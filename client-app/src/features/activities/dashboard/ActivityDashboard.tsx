import { useEffect, useState } from 'react';
import {Grid, Loader} from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponents';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';





//Remember to change the export default to use observer so App.tsx sees the property and displays the dashboard.
export default observer(function ActivityDashboard()
{  
    const{activityStore}=useStore();
    const{loadActivities,activityRegistry,setPagingParams,pagination}=activityStore;
    const[loadingNext,setLoadingNext]=useState(false);

    function handleGetNext(){
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage+1));
        loadActivities().then(()=>setLoadingNext(false));
    }

   

    useEffect(()=>{
     if(activityRegistry.size<=1)activityStore.loadActivities();
    },[activityStore,activityRegistry.size])
    //The array after the comma is called dependency array, putting something inside of it means that the hook will rerun the code only when that dependency changes,
    //this prevent unnecessary reruns or rerenders, if dependencies are empty,the hook will run only when the component is mounted
    
  
    //The full-page loader is not good UX, so 
    //if(activityStore.loadingInitial&&!loadingNext) return <LoadingComponent content='Activities is do the loadings'/>
    
    //A function can only return ONE element, so the header must be inside the div,we can't return both a header and a div
    //To avoid returning an empty div, we enclose everything that will be returned inside empty tags
    /*Remember that the destructuring syntax below is a shorter way of achieving this:
        const store = useStore();
        const activityStore = store.activityStore;*/
  
    //In React 18+ the type definitions of the infinite scroller don't work anymore and it will throw an error
    //To solve it you need to uninstall the type definitions and manually declare the module in the file src/react-infinite-scroller.d.ts

    //After removing the full-page loader we changed this section to display either the placeholders or the infinite scrollers
    //The check for the activityRegister is to prevent flickering
    return(
        <Grid>
            <Grid.Column width='10'>
                {activityStore.loadingInitial && activityRegistry.size===0 && !loadingNext?(
                    <>
                        <ActivityListItemPlaceholder/>
                        <ActivityListItemPlaceholder/>
                    </>
                ):(
                    <InfiniteScroll
                pageStart={0}
                loadMore={handleGetNext}
                hasMore={!loadingNext&& !!pagination &&pagination.currentPage<pagination.totalPages}
                initialLoad={false}
            >
                 <ActivityList />
                
            </InfiniteScroll>
                )}
            
       
            
            </Grid.Column>
            <Grid.Column width={'6'}>
                <ActivityFilters/>
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext}/>
            </Grid.Column>
           
        </Grid>
    )
})