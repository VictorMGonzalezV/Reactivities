import {createBrowserRouter,RouteObject} from 'react-router-dom';
import App from '../layout/App'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

export const routes:RouteObject[]=[
    {
        path:'/',
        element:<App />,
        children:[

            {path:'activities',element:<ActivityDashboard/>},
            {path:'activities/:id',element:<ActivityDetails/>},
            {path:'createActivity',element:<ActivityForm key='create'/>},
            {path:'manage/:id',element:<ActivityForm key='manage'/>},
            //Adding these keys ensures that the ActivityForm component will rerender when changing the route leading to it, else it won't since React preserves its state
            

        ]
    },

]

export const router=createBrowserRouter(routes);
