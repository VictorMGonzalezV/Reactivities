import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useStore } from "../../app/stores/store";
import { Button, Grid, Header, TabPane } from "semantic-ui-react";
import ProfileEditForm from "./ProfileEditForm";


export default observer(function ProfileAbout(){
    const{profileStore}=useStore();
    const{isCurrentUser,profile}=profileStore;
    const[editMode,setEditMode]=useState(false);
    
    return(
        <TabPane>
            <Grid>
                <Grid.Column width='16'>
                    <Header floated='left' icon='user' content={`About ${profile?.displayName}`}/>
                    {isCurrentUser&& (
                        <Button
                            floated='right'
                            basic
                            content={editMode?'Cancel':'Edit Profile'}
                            onClick={()=>setEditMode(!editMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width='16'>
                    {editMode?<ProfileEditForm setEditMode={setEditMode}/>:
                    <span style={{whiteSpace:'pre-wrap'}}>{profile?.bio}</span>}
                </Grid.Column>
            </Grid>
        </TabPane>
    )
})