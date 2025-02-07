
import { Header} from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";
import { Fragment } from "react/jsx-runtime";



export default observer (function ActivityList(){
    

    const{activityStore}=useStore();
    const{groupedActivities}=activityStore;

    {/* e is the convention for event, we use this target state and the name property in the buttons to prevent the onClick ->deleteActivity code from affecting all of the buttons 
        and showing a loading icon on all of them when a activity is deleted*/}

    return(
        <>
            {groupedActivities.map(([group,activities])=>(
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>           
                        {activities.map(activity=>(
                            <ActivityListItem key={activity.id} activity={activity}/>
                    ))}
      
                </Fragment>
            ))}
        </>
        
    )

})