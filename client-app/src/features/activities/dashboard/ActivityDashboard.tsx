import { useEffect } from 'react';
import { Grid} from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponents';
import ActivityFilters from './ActivityFilters';



//Remember to change the export default to use observer so App.tsx sees the property and displays the dashboard.
export default observer(function ActivityDashboard()
{  
    const{activityStore}=useStore();
    const{activityRegistry}=activityStore;

   

    useEffect(()=>{
     if(activityRegistry.size<=1)activityStore.loadActivities();
    },[activityStore,activityRegistry.size])
    //The array after the comma is called dependency array, putting something inside of it means that the hook will rerun the code only when that dependency changes,
    //this prevent unnecessary reruns or rerenders, if dependencies are empty,the hook will run only when the component is mounted
    
  
  
    if(activityStore.loadingInitial) return <LoadingComponent content='App is make loadings'/>
    //A function can only return ONE element, so the header must be inside the div,we can't return both a header and a div
    //To avoid returning an empty div, we enclose everything that will be returned inside empty tags
    /*Remember that the destructuring syntax below is a shorter way of achieving this:
        const store = useStore();
        const activityStore = store.activityStore;*/
  

    return(
        <Grid>
            <Grid.Column width='10'>
            <ActivityList 
                />
            </Grid.Column>
            <Grid.Column width={'6'}>
                <ActivityFilters/>
            </Grid.Column>
           
        </Grid>
    )
})