import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'semantic-ui-css/semantic.min.css'
import './app/layout/styles.css'
import 'react-datepicker/dist/react-datepicker.css'
import {RouterProvider} from 'react-router-dom'
import {store, StoreContext} from './app/stores/store'
import { router } from './app/router/Routes.tsx'
import 'react-calendar/dist/Calendar.css'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
      <RouterProvider router={router}/>
    </StoreContext.Provider>   
  </StrictMode>,
)
