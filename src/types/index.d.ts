export type User ={
    name:string;
    number:string
    active:boolean
}

export type toChangeCurrentUser =(arg:User)=>void