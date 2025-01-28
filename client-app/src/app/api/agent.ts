import axios, { AxiosResponse } from 'axios';
import { Activity } from '../layout/models/activity';

axios.defaults.baseURL='http://localhost:5000/api';

axios.interceptors.response.use(async response=>{
   try{
        await sleep(1000);
        return response;
   }catch (error){
        console.log(error);
        return await Promise.reject(error);

   }
 })

{/*Adding a generic type here allows the implementation of type safety when getting responses from the requests */}
const responseBody=<T>(response:AxiosResponse<T>)=>response.data;

const sleep=(delay:number)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve,delay)
    })
}

const requests={
    get:<T>(url:string)=>axios.get<T>(url).then(responseBody),
    post:<T>(url:string,body:{})=>axios.post<T>(url).then(responseBody),
    put:<T>(url:string,body:{})=>axios.put<T>(url).then(responseBody),
    del:<T>(url:string)=>axios.delete<T>(url).then(responseBody),
}

const Activities={
    list:()=>requests.get<Activity[]>('/activities'),
    details:(id:string)=>requests.get<Activity>(`/activities/${id}`),
    create:(activity:Activity)=>requests.post('activities',activity),
    update:(activity:Activity)=>axios.put(`/activities/${activity.id}`,activity),
    delete:(id:string)=>axios.delete(`/activities/${id}`)
}

const agent={
    Activities
}

export default agent;