import { ChangeEvent, useEffect, useState } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/layout/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import {v4 as uuid} from 'uuid';



export default observer(function ActivityForm(){
    const {activityStore}=useStore();
    const{updateActivity,createActivity,loading, loadActivity,loadingInitial}=activityStore;
    //The useParams() hook allows using the URL parameters as values, so it will get id from /activities/:id
    const{id}=useParams();
    const navigate=useNavigate();

    const [activity,setActivity]=useState<Activity>({
        id:'',
        title:'',
        category:'',
        description:'',
        date:'',
        city:'',
        venue:''

    });

    useEffect(()=>{
        if(id) loadActivity(id).then(activity=>setActivity(activity!))
    },[id,loadActivity]);


    function handleSubmit(){
        if(!activity.id)
        {
            activity.id=uuid();
            createActivity(activity).then(()=>navigate(`/activities/${activity.id}`));
        }else{
            updateActivity(activity).then(()=>navigate(`/activities/${activity.id}`))
        }
      
    }

    {/*Adding value={activity.title} to the input form field is not enough, it won't allow users to type anything in unless the input change is handled with a function */}
    function handleInputChange(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
        const{name,value}=event.target;
        //console.log(name, value);//Debugging the date issue
        setActivity({...activity,[name]:value})
    }

    if(loadingInitial) return <LoadingComponent content='Activity is make load...'/>

    return(
        
    <Segment clearing>
        <Form onSubmit={handleSubmit} autoComplete='off'>
            <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}/>
            <Form.TextArea placeholder='Description 'value={activity.description} name='description' onChange={handleInputChange}/>
            <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/>
            <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}/>
            <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
            <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/>
            <Button loading={loading} floated='right' positive type='submit' content='Submit'/>
            <Button as={Link} to='/activities' floated='right' type='button' content='Cancel'/>
        </Form>
    </Segment>
    )
})