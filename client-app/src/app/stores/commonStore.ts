import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore{
    error: ServerError|null=null;
    token: string|null=localStorage.getItem('jwt');
    appLoaded=false;

    constructor(){
        makeAutoObservable(this);

        //This reaction will be called when the value of the token in the DOM changes, it either updates local storage with the new token, or removes it if the user logged out
        reaction(
            ()=>this.token,
            token=>{
                if(token){
                    localStorage.setItem('jwt',token)
                }else{
                    localStorage.removeItem('jwt')
                }
            }
            
        )
    }

    setServerError(error:ServerError){
        this.error=error;

    }
    
    setToken=(token:string|null)=>{
        this.token=token;

    }

    setAppLoaded=()=>{
        this.appLoaded=true;
    }
}