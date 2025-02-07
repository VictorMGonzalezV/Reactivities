import {  makeAutoObservable, runInAction} from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid} from "uuid";


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
        return Array.from(this.activityRegistry.values()).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
    }

    get groupedActivities(){
        return Object.entries((
            this.activitiesByDate.reduce((activities,activity)=>{
                const date=activity.date;
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
        //console.log(activity.date);//Debugging the date issue
        activity.date=activity.date.split('T')[0];
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

    createActivity=async(activity:Activity)=>{
        this.loading=true;
        activity.id=uuid();
        try {
            await agent.Activities.create(activity);
            runInAction(()=>{
                this.activityRegistry.set(activity.id,activity);
                this.selectedActivity=activity;
                this.editMode=false;
                this.loading=false;
            })
            
        } catch (error) {
            console.log(error);
            runInAction(()=>{
                this.loading=false;
            })
        }

    }

    updateActivity=async(activity:Activity)=>{
        this.loading=true;
        try {
            await agent.Activities.update(activity);
            runInAction(()=>{
                //This shorthand syntax uses spread to create new array with all of the original activities minus the updated one, and include the updated one as part of it
                this.activityRegistry.set(activity.id,activity);
                this.selectedActivity=activity;
                this.editMode=false;
                this.loading=false;
          
            })
            
        } catch (error) {
            console.log(error)
            runInAction(()=>{
                this.loading=false;
            })
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
}

