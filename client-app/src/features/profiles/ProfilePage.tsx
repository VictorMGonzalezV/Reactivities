import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponents";

export default observer(function ProfilePage(){
    const{username}=useParams<{username:string}>();
    const{profileStore}=useStore();
    const{loadingProfile,loadProfile,profile,setActiveTab}=profileStore;

    useEffect(()=>{
      if(username)loadProfile(username);
      return()=>{
        setActiveTab(0);
      }
    },[loadProfile,username,setActiveTab])

    if(loadingProfile) return <LoadingComponent content='Profile is do the load, of waitings...'/>
    return(
        <Grid>
            <Grid.Column width={16}>
                {profile&&
                <>
                      <ProfileHeader profile={profile}/>
                      <ProfileContent profile={profile}/>
                </>}
          
            </Grid.Column>
        </Grid>
    )
})