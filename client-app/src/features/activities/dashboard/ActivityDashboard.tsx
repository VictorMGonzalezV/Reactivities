import React from 'react';
import { Grid} from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';



//Remember to change the export default to use observer so App.tsx sees the property and displays the dashboard.
export default observer(function ActivityDashboard()
{
    /*Remember that the destructuring syntax below is a shorter way of achieving this:
        const store = useStore();
        const activityStore = store.activityStore;*/
    const{activityStore}=useStore();
    const{selectedActivity,editMode}=activityStore;

    return(
        <Grid>
            <Grid.Column width='10'>
            <ActivityList 
                />
            </Grid.Column>
            <Grid.Column width={'6'}>
                {/*The syntax && makes the code after && execute only if activities[0] isn't null, preventing the app from crashing because the ActivityDetails component loads before
                the application has access to the activity object, this makes it wait until the object loads */}
                {selectedActivity && !editMode &&
                <ActivityDetails                         
                />}
                {editMode&&
                <ActivityForm         
                />}
            </Grid.Column>
           
        </Grid>
    )
})