import axios, { AxiosError, AxiosResponse } from 'axios';
import { Activity, ActivityFormValues } from '../models/activity';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { User, UserFormValues } from '../models/user';
import { Photo, Profile, UserActivity } from '../models/profile';
import { PaginatedResult } from '../models/pagination';

axios.defaults.baseURL='http://localhost:5000/api';

axios.interceptors.response.use(async response=>{
   
        await sleep(1000);
        const pagination=response.headers['pagination'];
        if(pagination){
            response.data=new PaginatedResult(response.data,JSON.parse(pagination));
            return response as AxiosResponse<PaginatedResult<any>>
        }
        return response;

   
 },(error:AxiosError)=>{const{data,status,config}=error.response as AxiosResponse;
 switch(status){
    case 400:
        if(config.method==='get'&&data.errors.hasOwnProperty('id')){
            router.navigate('/not-found');
        }
        //Use this to flatten the errors response, an array of arrays, into a simple array of strings
        if(data.errors){
            const modalStateErrors=[];
            for(const key in data.errors){
                if(data.errors[key]){
                    modalStateErrors.push(data.errors[key])
                }
            }
            throw modalStateErrors.flat();

        }else{
            toast.error(data);
        }
        break;

    case 401:
        toast.error('Unauthorized')
        break;

    case 403:
        toast.error('Forbidden')
        break;
    
    case 404:
        router.navigate('/not-found');
        break;

    case 500:
        store.commonStore.setServerError(data);
        router.navigate('/server-error');
        
        break;

 }
 return Promise.reject(error);


})

/*Adding a generic type here allows the implementation of type safety when getting responses from the requests */
const responseBody=<T>(response:AxiosResponse<T>)=>response.data;

axios.interceptors.request.use(config=>{
    const token=store.commonStore.token;
    if(token&&config.headers) config.headers.Authorization=`Bearer ${token}`;
    return config;
})

const sleep=(delay:number)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve,delay)
    })
}

const requests={
    get:<T>(url:string)=>axios.get<T>(url).then(responseBody),
    //We configure the request to accept an optional headers parameter so we can specify the content type and prevent the 415 error
    post:<T>(url:string,body:{},headers={})=>axios.post<T>(url, body,{headers}).then(responseBody),
    put:<T>(url:string,body:{},headers={})=>axios.put<T>(url,body,{headers}).then(responseBody),
    del:<T>(url:string)=>axios.delete<T>(url).then(responseBody),
}


const Activities={
    list:(params:URLSearchParams)=>axios.get<PaginatedResult<Activity[]>>('/activities',{params}).then(responseBody),
    details:(id:string)=>requests.get<Activity>(`/activities/${id}`),
    create:(activity:ActivityFormValues)=>requests.post<void>('/activities',activity),
    update:(activity:ActivityFormValues)=>requests.put<void>(`/activities/${activity.id}`,activity),
    delete:(id:string)=>requests.del<void>(`/activities/${id}`),
    attend:(id:string)=>requests.post<void>(`/activities/${id}/attend`,{})
}

const Account={
    current:()=>requests.get<User>('/account'),
    //We're setting the content type header manually here to solve the 415 unsupported media type error
    login:(user:UserFormValues)=>requests.post<User>('/account/login',user,{headers:{'Content-Type':'application/json'}}),
    register:(user:UserFormValues)=>requests.post<User>('/account/register',user)
}

const Profiles={
    get:(username:string)=>requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto:(file:Blob)=>{
        let formData=new FormData();
        formData.append('File',file);
        return axios.post<Photo>('photos',formData,{
            headers:{'Content-Type':'multipart/form-data'}
        })

    },
    setMainPhoto:(id:string)=>requests.post(`/photos/${id}/setMain`,{}),
    deletePhoto:(id:string)=>requests.del(`/photos/${id}`),
    //In TypeScript, Partial<T> is a utility type that constructs a new type based on T, but makes all properties optional,
    //This means users won't have to supply any mandatory property we may not want to be modifiable.
    updateProfile:(profile:Partial<Profile>)=>requests.put(`/profiles`,profile),
    updateFollowing:(username:string)=>requests.post(`follow/${username}`,{}),
    listFollowings:(username:string,predicate:string)=>requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities:(username:string,predicate:string)=>requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
}



const agent={
    Activities,
    Account,
    Profiles
}

export default agent;

