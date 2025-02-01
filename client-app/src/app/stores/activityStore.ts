import {  makeAutoObservable, runInAction} from "mobx";
import { Activity } from "../layout/models/activity";
import agent from "../api/agent";
import { v4 as uuid} from "uuid";


export default class ActivityStore{
    activityRegistry=new Map<string,Activity>();
    selectedActivity:Activity|undefined=undefined;
    editMode=false;
    loading=false;
    loadingInitial=true;
    

    constructor(){
        /**makeAutoObservable turns all properties into observables */
        makeAutoObservable(this)
    }

    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
    }

   /* By using an arrow function here, we bind the action to the class, else we'd need to define setTitle as action.bound in the constructor
    setTitle=()=>{
        this.title=this.title+'!';
    }*/

    loadActivities=async()=>{
        try {
            const activities=await agent.Activities.list();
            /*Since we're using MobX strict mode, changing observable values without using an action isn't allowed, and we're using await, so any steps after it won't be in the same
            tick, so they need to be wrapped in an action, to do this we move the code inside a runInAction arrow function*/  
                activities.forEach(activity=>{
                    activity.date=activity.date.split('T')[0];
                    this.activityRegistry.set(activity.id,activity);
                })            
           
             this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
       
                this.setLoadingInitial(false);          
        }
    }
    setLoadingInitial=(state:boolean)=>{
        this.loadingInitial=state;
    }

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
    }

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
                if(this.selectedActivity?.id===id) this.cancelSelectedActivity();
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

