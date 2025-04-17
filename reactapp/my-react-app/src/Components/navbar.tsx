import React from "react";
import notificationIcon from "../assets/images/notification.png";
import cartIcon from "../assets/images/shopping-bag.png";
import loginIcon from "../assets/images/login.png";
import AuthProvider, { useAuth } from "./AuthContext";
import { Link, Route, Router, Routes } from "react-router-dom";
import SingleBookView from "./SingleBookView";
import Notifications from "./Notifications";
import Notificationss from "./AnotherNot";
export default function Navbar({ onLoginClick ,onCartClick}: { onLoginClick: () => void ,onCartClick:()=>void}) {
   const {user,logout}=useAuth();
   const username=localStorage.getItem("username");
   const firstLetter = username?.charAt(0).toUpperCase();
  
   interface Props {
    username?: string; // optional prop
  }
  
  return (
    
    <div className="navbar" >
      <div className="logo"></div>

      <ul className="nav-links">
        <li>
         
          <Link to="/" >Home</Link>
        </li>
        
{username === "admin" ? (
  <li className="center">
    <Link to="/WelcomeAdmin">Admin Panel</Link>
  </li>
) : null}
       
        
        <li className="upward">
          <Link to="/chat">ChatRoom</Link>
         
        </li>

      </ul>

      <div className="icons">
        {/* Notification Icon */}
        <span className="CartIcon">
          <img id="notiIcon" src={notificationIcon} alt="Notifications" width="20" />
          {username?(
            <>
           
              <Notifications accountname={username}></Notifications>
              <Notificationss accountname={username}></Notificationss>
              </>
          ):(
""
          )}
        
        </span>

        {/* Cart Icon */}
        <span className="CartIcon cartBtn" id="cartBtn" onClick={onCartClick}>
          <img src={cartIcon} alt="Cart" width="20"  />
        </span>

        {/* User Profile Avatar */}
       
        {/* Login Avatar with Click Event */}
        {username ?(
         
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"4px",marginTop:"-5px"}}>
          <div  style={{ width: 30, height: "auto",fontSize:20,display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",backgroundColor:"white",borderRadius:"50%",color:"brown", }}>
  
          <Link to={"/Profile"}> {firstLetter}</Link>
 
</div>
          <span>Welcome,{username}!</span>
          
          </div>
        ):(



<span className="UserAvatar" onClick={onLoginClick}>
          <a>
           
            <img src={loginIcon} alt="Login" id="openLoginForm"  />
          </a>
        </span>
        )}
        
        
      </div>
    </div>
   
  );

 
}
