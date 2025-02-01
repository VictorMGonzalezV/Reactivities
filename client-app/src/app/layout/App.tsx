
import { useEffect} from 'react'
import { Container} from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponents';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';


function App() {
  const {activityStore}=useStore();

 

  useEffect(()=>{
   activityStore.loadActivities();
  },[activityStore])
  //The array after the comma is called dependency array, putting something inside of it means that the hook will rerun the code only when that dependency changes,
  //this prevent unnecessary reruns or rerenders, if dependencies are empty,the hook will run only when the component is mounted
  


  if(activityStore.loadingInitial) return <LoadingComponent content='App is make loadings'/>
  //A function can only return ONE element, so the header must be inside the div,we can't return both a header and a div
  //To avoid returning an empty div, we enclose everything that will be returned inside empty tags
  return (
    <>
      <NavBar />
      <Container style={{marginTop:'7em'}}>
        <ActivityDashboard  />
      </Container>
    </>
  );
}
/*We need to pass the function to the observer function here so that it registers the changes to observable properties when MobX actions alter them */
export default observer(App);
