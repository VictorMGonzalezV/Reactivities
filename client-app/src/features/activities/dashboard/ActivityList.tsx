import React, { SyntheticEvent, useState } from "react";
import { Activity } from "../../../app/layout/models/activity";
import { Item,Segment,Button, Label } from "semantic-ui-react";

interface Props{
    activities: Activity[];
    selectActivity:(id:string)=>void;
    deleteActivity:(id:string)=>void;
    submitting:boolean;
}

export default function ActivityList({activities,selectActivity,deleteActivity,submitting}:Props){
    
    const[target,setTarget]=useState('');
    {/* e is the convention for event, we use this target state and the name property in the buttons to prevent the onClick ->deleteActivity code from affecting all of the buttons 
        and showing a loading icon on all of them when a activity is deleted*/}
    function handleActivityDelete(e:SyntheticEvent<HTMLButtonElement>,id:string){
        setTarget(e.currentTarget.name);
        deleteActivity(id);

    }

    return(
        <Segment>
            <Item.Group divided>
                {activities.map(activity=>(
                    <Item key={activity.id}>

                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city},{activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={()=>selectActivity(activity.id)} floated='right' content='View' color="blue"/>
                                <Button 
                                    name={activity.id}
                                    loading={submitting&&target===activity.id} 
                                    onClick={(e)=>handleActivityDelete(e,activity.id)} 
                                    floated='right' 
                                    content='Delete' 
                                    color="red"
                                />
                                <Label basic content={activity.category}/>
                            </Item.Extra>
                        </Item.Content>

                    </Item>
                ))}
            </Item.Group>
            
        </Segment>
    )

}