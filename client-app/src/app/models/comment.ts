//The object is called ChatComment to avoid a conflict with the Semantic UI Comment component
export interface ChatComment{
    id:number;
    createdAt:Date;
    body:string;
    username:string;
    displayName:string;
    image:string;


}