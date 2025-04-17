import { createContext,useContext,useState,useEffect } from "react";
interface AuthContextType{
    user:{username:string,token:string}|null;
    login:(username:string,token:string)=>void;
    logout:()=>void;

}
const AuthContext=createContext<AuthContextType|undefined>(undefined);
export default function AuthProvider({children}:{children:React.ReactNode}){
    const[user,setUser]=useState<{username:string;token:string}|null>(null);
    //on page reload loading user from token
    


    const login=(username:string,token:string)=>{
        localStorage.setItem("token",token);
        localStorage.setItem("username",username);
        setUser({username,token});
    };

    const logout=()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUser(null);
    };
    return(
     <AuthContext.Provider value={{user,login,logout}}>
        {children}
        </AuthContext.Provider>
    );

}

export function useAuth(){
    const context=useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be use with AuthProvider");
    }
    return context;
}