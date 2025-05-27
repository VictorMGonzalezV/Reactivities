import {  makeAutoObservable, runInAction} from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid} from "uuid";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";


export default class ActivityStore{
    activityRegistry=new Map<string,Activity>();
    selectedActivity:Activity|undefined=undefined;
    editMode=false;
    loading=false;
    loadingInitial=false;
    

    constructor(){
        /**makeAutoObservable turns all properties into observables */
        makeAutoObservable(this)
    }

    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a,b)=>a.date!.getTime()-b.date!.getTime());
    }

    get groupedActivities(){
        return Object.entries((
            this.activitiesByDate.reduce((activities,activity)=>{
                const date= format(activity.date!,'dd MMM yyyy h:mm aa');
                activities[date]=activities[date]?[...activities[date],activity]:[activity];
                return activities;
            },{} as {[key:string]:Activity[]})
        )

        )
    }

   /* By using an arrow function here, we bind the action to the class, else we'd need to define setTitle as action.bound in the constructor
    setTitle=()=>{
        this.title=this.title+'!';
    }*/

    loadActivities=async()=>{
        try {
            this.setLoadingInitial(true);
            const activities=await agent.Activities.list();
            /*Since we're using MobX strict mode, changing observable values without using an action isn't allowed, and we're using await, so any steps after it won't be in the same
            tick, so they need to be wrapped in an action, to do this we move the code inside a runInAction arrow function*/  
                activities.forEach(activity=>{
                    this.setActivity(activity);
                    
                })            
           
             this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
       
                this.setLoadingInitial(false);          
        }
    }

    loadActivity= async(id:string)=>{
        let activity=this.getActivity(id);
        if(activity) {
            this.selectedActivity=activity;
            return activity;
        }
        else{
            this.setLoadingInitial(true);
            try {
                activity=await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(()=>this.selectedActivity=activity);             
                this.setLoadingInitial(false);
                return activity;
                
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
                
            }
        }

    }

    private getActivity=(id:string)=>{
        return this.activityRegistry.get(id);
    }

    private setActivity=(activity:Activity)=>{
        const user=store.userStore.user;
        if(user){
            activity.isGoing=activity.attendees!.some(
                a=>a.username===user.username
            )
            activity.isHost=activity.hostUsername===user.username;
            activity.host=activity.attendees?.find(x=>x.username===activity.hostUsername);
        }
        //console.log(activity.date);//Debugging the date issue
        activity.date=new Date(activity.date!);
        this.activityRegistry.set(activity.id,activity);

    }

    setLoadingInitial=(state:boolean)=>{
        this.loadingInitial=state;
    }
    /*These 4 methods aren't needed anymore since routing takes care of those actions
    selectActivity=(id:string)=>{
        this.selectedActivity=this.activityRegistry.get(id);
    }

    cancelSelectedActivity=()=>{
        this.selectedActivity=undefined;
    }

    openForm=(id?:string)=>{
        this.editMode=true;
        id?this.selectActivity(id):this.cancelSelectedActivity();

    }

    closeForm=()=>{
        this.editMode=false;
    }*/

    createActivity=async(activity:ActivityFormValues)=>{
        const user=store.userStore.user;
        const attendee=new Profile(user!);

        activity.id=uuid();
        try {
            await agent.Activities.create(activity);
            const newActivity=new Activity(activity);
            newActivity.hostUsername=user!.username;
            newActivity.attendees=[attendee];
            this.setActivity(newActivity);
            runInAction(()=>{
                this.selectedActivity=newActivity;
            })
            
        } catch (error) {
            console.log(error);
            runInAction(()=>{
                
            })
        }

    }

    updateActivity=async(activity:ActivityFormValues)=>{

        try {
            await agent.Activities.update(activity);
            runInAction(()=>{
                if(activity.id){
                    const updatedActivity={...this.getActivity(activity.id),...activity}
                    this.activityRegistry.set(activity.id,updatedActivity as Activity);
                    this.selectedActivity=updatedActivity as Activity;
                }       
             
          
            })
            
        } catch (error) {
            console.log(error)
        }

    }
    
    deleteActivity=async(id:string)=>{
        this.loading=true;
        try {
            await agent.Activities.delete(id);
            runInAction(()=>{
                console.log(`Deletings of ${id}`);
                this.activityRegistry.delete(id);
                this.loading=false;
        })
            
        } catch (error) {
            console.log(error);
            runInAction(()=>{
                this.loading=false;
            })
            
        }
    }

    updateAttendance=async()=>{
        const user=store.userStore.user;
        this.loading=true;
        try {
              await agent.Activities.attend(this.selectedActivity!.id);
              runInAction(()=>{
                if(this.selectedActivity?.isGoing){
                    this.selectedActivity.attendees=this.selectedActivity.attendees?.filter(a=>a.username!==user?.username);
                    this.selectedActivity.isGoing=false;
                }else{
                    const attendee=new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing=true;
                }
                this.activityRegistry.set(this.selectedActivity!.id,this.selectedActivity!);
              })
            
        } catch (error) {
            console.log(error);
        } finally{
            runInAction(()=>this.loading=false);
        }
    }

    cancelActivityToggle=async()=>{
        this.loading=true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                this.selectedActivity!.isCancelled=!this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id,this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
            
        }finally{
            runInAction(()=>this.loading=false);
        }
    }

    clearSelectedActivity=()=>{
        this.selectedActivity=undefined;
    }

    updateAttendeeFollowing=(username:string)=>{
        this.activityRegistry.forEach(activity=>{
            activity.attendees?.forEach(attendee=>{
                if (attendee.username===username){
                    attendee.following?attendee.followersCount--:attendee.followersCount++;
                    attendee.following=!attendee.following;
                }
            })
        })

    }
}

