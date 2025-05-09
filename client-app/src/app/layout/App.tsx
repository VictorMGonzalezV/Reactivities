
import { Container} from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/activities/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import LoadingComponent from './LoadingComponents';
import ModalContainer from '../common/modals/ModalContainer';


function App() {
  const location=useLocation();
  const{commonStore,userStore}=useStore();

  useEffect(()=>{
    if(commonStore.token){
      userStore.getUser().finally(()=>commonStore.setAppLoaded())
    }else{
      commonStore.setAppLoaded();
    }
    
  },[commonStore,userStore])
  if(!commonStore.appLoaded) return <LoadingComponent content='Loading app...'/>

  return (
    <>
    <ModalContainer/>
      <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
    {location.pathname==='/'?<HomePage/>:(
      <>
        <NavBar />
        <Container style={{marginTop:'7em'}}>
          <Outlet  />
        </Container>
        </>

    )}
      
    </>
  );
}
/*We need to pass the function to the observer function here so that it registers the changes to observable properties when MobX actions alter them */
export default observer(App);
