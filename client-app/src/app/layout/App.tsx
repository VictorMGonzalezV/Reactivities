
import { Container} from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/activities/home/HomePage';
import { ToastContainer } from 'react-toastify';


function App() {
  const location=useLocation();

  return (
    <>
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
