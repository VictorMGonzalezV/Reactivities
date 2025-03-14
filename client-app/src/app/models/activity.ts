import { Profile } from "./profile"

export interface IActivity {
    id: string
    title: string
    date: Date|null
    description: string
    category: string
    city: string
    venue: string
    hostUsername?:string;
    isCancelled?:boolean;
    isGoing:boolean;
    isHost:boolean;
    host?:Profile;
    attendees?:Profile[];
  }

  /*This shortcut could work if we don't have the strict linting rules that prohibit having an interface and a class with the same name
  export class Activity implements Activity{
    constructor(init?:ActivityFormValues){
      Object.assign(this,init);
    }
  }*/

  export class Activity implements IActivity{
    constructor(init:ActivityFormValues){
      this.id=init.id!
      this.title=init.title
      this.date=init.date
      this.description=init.description
      this.category=init.category
      this.venue=init.venue
      this.city=init.city
    }

    id: string
    title: string
    date: Date|null
    description: string
    category: string
    city: string
    venue: string
    hostUsername?:string='';
    isCancelled?:boolean=false;
    isGoing:boolean=false;
    isHost:boolean=false;
    host?:Profile;
    attendees?:Profile[];
  }

  export class ActivityFormValues{
    id?:string=undefined;
    title:string='';
    category:string='';
    description:string='';
    date:Date|null=null;
    city:string='';
    venue:string='';

    constructor(activity?:ActivityFormValues){
      if(activity){
        this.id=activity.id;
        this.title=activity.title;
        this.category=activity.category;
        this.date=activity.date;
        this.venue=activity.venue;
        this.city=activity.city;
      }

    }
  }
  