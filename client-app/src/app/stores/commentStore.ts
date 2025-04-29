import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore{
    comments:ChatComment[]=[];
    hubConnection:HubConnection|null=null;

    constructor(){
        makeAutoObservable(this);
    }

    createHubConnection=(activityId:string)=>{
        if(store.activityStore.selectedActivity){
            this.hubConnection=new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?activityId='+activityId,{
                    //It's called a factory but it doesn't generate a token object, it simply retrieves it from the user, so it works like a getter
                    accessTokenFactory:()=>store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection.start().catch(error=>console.log('Cannot into connect to SignalR Hub kurwa: ',error));


            this.hubConnection.on('LoadComments',(comments:ChatComment[])=>{
                runInAction(()=>{
                    comments.forEach(comment=>{
                        comment.createdAt=new Date(comment.createdAt);
                    })
                    this.comments=comments
                });
            });
            //Remember to use unshift instead of push since the comments will be sorted in descending order
            this.hubConnection.on('ReceiveComment',(comment:ChatComment)=>{
                runInAction(()=>{
                    comment.createdAt=new Date(comment.createdAt);
                        this.comments.unshift(comment);
                    })
            })
        }
    }

    stopHubConnection=()=>{
        this.hubConnection?.stop().catch(error=>console.log('Error stopping connection: ',error));
    }

    clearComments=()=>{
        this.comments=[];
        this.stopHubConnection();

    }

    addComment=async(values:any)=>{
        values.ActivityId=store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke('SendComment',values)
        } catch (error) {
            console.log(error);
        }
    }

}