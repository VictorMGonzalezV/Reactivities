import React from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardMeta, Icon,Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponents";



export default function ActivityDetails(){
    const{activityStore}=useStore();
    const{selectedActivity:activity,openForm,cancelSelectedActivity}=activityStore;

    if(!activity) return <LoadingComponent content='App is make loadings'/>;

    return(
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`}/>
            <CardContent>
            <CardHeader>Matthew</CardHeader>
            <CardMeta>
                <span >{activity.date}</span>
            </CardMeta>
            <CardDescription>
                {activity.description}
            </CardDescription>
                </CardContent>
                <CardContent extra>
                    <Button.Group widths='2'>
                        <Button onClick={()=>openForm(activity.id)}basic color='blue' content='Edit'/>
                        <Button onClick={cancelSelectedActivity} basic color='grey' content='Cancel'/>

                    </Button.Group>
                </CardContent>
      </Card>
    )

}