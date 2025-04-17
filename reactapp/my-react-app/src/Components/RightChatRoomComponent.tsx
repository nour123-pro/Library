import { useEffect, useState } from "react";
import { Account, Book, ChatRoom, User } from "./interfaces";
import axios from "axios";

export default function RightChatRoomComponent({selectedchatroom,usernamee}:{selectedchatroom:ChatRoom,usernamee:String}) {
  const[username,setusername]=useState<String>('');
  const[showbuttonEnroll,setshowbuttonEnroll]=useState<Boolean>(false);
  const[showbuttonCancelEnroll,setbuttonCancelEnroll]=useState<Boolean>(false);
  const[Subscribers,setSubscribers]=useState<Account[]>();
   const EnrollInChatRoom=async ()=>{
    const apiUrl = 'http://localhost:5000/api/ChatAccount/AddNewChatAccount';
    const chatroomid=selectedchatroom.chatRoomId;
    const requestdata={
      chatroomid,
      username
    }
   
   
    try {
      // Correct axios syntax
      const response = await axios.post(apiUrl,requestdata,{
        headers: { 
          'Content-Type': 'application/json' ,
          'Accept': 'application/json'
        },
        // withCredentials: true // Uncomment if using cookies
      });
  
      // Axios wraps the response in a 'data' property
      if (response.data) {
        if(response.data.success=="true"){
          alert(response.data.message);
        }
       
       
    }
  
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Proper error handling for Axios
        const serverResponse = error.response?.data;
                if (serverResponse?.errors) {
                    console.log(serverResponse.errors.join('\n'));
                } 
                else if (serverResponse?.message) {
                    console.log(serverResponse.message);
                }
                else {
                    console.log(error.response?.statusText || 'Enrolled  failed');
                }
      } else {
       if (axios.isAxiosError(error)) {
         const serverResponse = error.response?.data;
   
         if (serverResponse?.errors) {
           console.log(serverResponse.errors.join('\n'));
         } else if (serverResponse?.message) {
           console.log(serverResponse.message);
         } else {
          console.log(error.response?.statusText || 'Fetching ChatRooms failed');
         }
       } else {
        console.log(String(error));
       }
      }
    }
   };
  
  
  const CancelEnrollmentInChatRoom=async()=>{
    const apiUrl = 'http://localhost:5000/api/ChatAccount/DeleteChatAccount';
    const chatroomid=selectedchatroom.chatRoomId;
    const requestdata={
      chatroomid,
      username
    }
   
   
    try {
      // Correct axios syntax
      const response = await axios.post(apiUrl,requestdata,{
        headers: { 
          'Content-Type': 'application/json' ,
          'Accept': 'application/json'
        },
        // withCredentials: true // Uncomment if using cookies
      });
  
      // Axios wraps the response in a 'data' property
      if (response.data) {
        if (response.data) {
          if(response.data.success=="true"){
            alert(response.data.message);
          }
         
         
      }
        setshowbuttonEnroll(true);
       
    }
  
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Proper error handling for Axios
        const serverResponse = error.response?.data;
                if (serverResponse?.errors) {
                    console.log(serverResponse.errors.join('\n'));
                } 
                else if (serverResponse?.message) {
                    console.log(serverResponse.message);
                }
                else {
                    console.log(error.response?.statusText || 'Enrolled  failed');
                }
      } else {
       if (axios.isAxiosError(error)) {
         const serverResponse = error.response?.data;
   
         if (serverResponse?.errors) {
           console.log(serverResponse.errors.join('\n'));
         } else if (serverResponse?.message) {
           console.log(serverResponse.message);
         } else {
          console.log(error.response?.statusText || 'Fetching ChatRooms failed');
         }
       } else {
        console.log(String(error));
       }
      }
    }
  };
  

  const IsEnrolledInChatRoom=async()=>{
    const apiUrl = 'http://localhost:5000/api/ChatAccount/IsEnrolledInChatRoom';
    const chatroomid=selectedchatroom.chatRoomId;
    const requestdata={
      chatroomid,
      username
    }
    
    
    try {
      // Correct axios syntax
      const response = await axios.post(apiUrl,requestdata,{
        headers: { 
          'Content-Type': 'application/json' ,
          'Accept': 'application/json'
        },
        // withCredentials: true // Uncomment if using cookies
      });
     
      // Axios wraps the response in a 'data' property
      if (response?.data) {
        try {
          const Enrolled = response.data.enrolled;
          console.log(Enrolled);
          setshowbuttonEnroll(!Enrolled);
          setbuttonCancelEnroll(Enrolled);
         
        } catch (error) {
          console.log("Error processing response:"+response.data.enrolled);
        }
      }
  
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Proper error handling for Axios
        const serverResponse = error.response?.data;
                if (serverResponse?.errors) {
                    console.log(serverResponse.errors.join('\n'));
                } 
                else if (serverResponse?.message) {
                    console.log(serverResponse.message);
                }
                else {
                    console.log(error.response?.statusText || 'Enrolled  failed');
                }
      } else {
       if (axios.isAxiosError(error)) {
         const serverResponse = error.response?.data;
   
         if (serverResponse?.errors) {
           console.log(serverResponse.errors.join('\n'));
         } else if (serverResponse?.message) {
           console.log(serverResponse.message);
         } else {
          console.log(error.response?.statusText || 'Fetching ChatRooms failed');
         }
       } else {
        console.log(String(error));
       }
      }
    }
  };
  
  const fetchSubscribers=async ()=>{
    const apiUrl = 'http://localhost:5000/api/ChatAccount/Subscribers';
    const chatroomid=selectedchatroom.chatRoomId;
    const requestdata={
      chatroomid,
      
    }
    
    
    try {
      // Correct axios syntax
      const response = await axios.post<Account[]>(apiUrl,requestdata,{
        headers: { 
          'Content-Type': 'application/json' ,
          'Accept': 'application/json'
        },
        // withCredentials: true // Uncomment if using cookies
      });
     
      // Axios wraps the response in a 'data' property
      if (response?.data) {
       setSubscribers(response.data); 
      }
  
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Proper error handling for Axios
        const serverResponse = error.response?.data;
                if (serverResponse?.errors) {
                    console.log(serverResponse.errors.join('\n'));
                } 
                else if (serverResponse?.message) {
                    console.log(serverResponse.message);
                }
                else {
                    console.log(error.response?.statusText || 'Enrolled  failed');
                }
      } else {
       if (axios.isAxiosError(error)) {
         const serverResponse = error.response?.data;
   
         if (serverResponse?.errors) {
           console.log(serverResponse.errors.join('\n'));
         } else if (serverResponse?.message) {
           console.log(serverResponse.message);
         } else {
          console.log(error.response?.statusText || 'Fetching ChatRooms failed');
         }
       } else {
        console.log(String(error));
       }
      }
    }
  };
  useEffect(() => {
    // Set the username first
    setusername(usernamee); // Make sure this is the correct variable name
  
    if (username != null) {
      // Add a small delay to ensure state is fully updated
      const timer = setTimeout(() => {
        IsEnrolledInChatRoom();
        fetchSubscribers();
      }, 300); // 100ms delay (adjust as needed)
  
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [username]); // Runs when username changes
    return(
        <div className="right-sidebar">
        <div className="header">
          <img alt="Group avatar" className="avatar" height="40" src="https://placehold.co/40x40" width="40"/>
          <div className="group-info">
            <div className="group-name">{selectedchatroom.chatRoomName}</div>
            <div className="group-status">{Subscribers?.length} Members • {Subscribers?.length} Online</div>
          </div>
        </div>
        
        <div className="buttons" style={{display:"flex",flexDirection:'row'}}>
                <div className="ButtonMute">
                  <i className="fi fi-tr-music-note-slash"></i>
                  <span>Unmute</span>
               </div>
               {
                showbuttonCancelEnroll?(
                  <div className="ButtonMute" onClick={()=>CancelEnrollmentInChatRoom()}>
                  <i className="fi fi-ss-leave" style={{color: "red"}}></i>
                  <span>Leave</span>
               </div>
                ):
                <div>{showbuttonCancelEnroll}</div>
               }
              
               {showbuttonEnroll?(
                <div className="ButtonMute" onClick={()=>EnrollInChatRoom()}>
                  <i className="fi fi-ss-enter" style={{color: "purple"}}></i>
                  <span>Enroll</span>
               </div>
      
               ):null}
               
          
        </div>
        
        <div className="book-info">
           <div className="ButtonShape">
            <span>
              <i className="fi fi-ts-book-open-cover" ></i>
            Book Name
            </span>
            <span className="text-gray-500">
             {selectedchatroom.book.bookName}
             <i className="fi fi-rr-arrow-right"></i>
            </span>
            </div>
            <div className="ButtonShape">
              
              <span>
               
                  <i className="fi fi-rr-copyright" ></i>
              Author
              </span>
              <span className="text-gray-500">
               {selectedchatroom.book.author?.authorName}
               <i className="fi fi-rr-arrow-right"></i>
              </span>
              </div>
      
              <div className="ButtonShape">
              
                  <span>
                   
                      <i className="fi fi-rs-star" ></i>
                  Rating
                  </span>
                  <span className="text-gray-500">
                   3.4
                   <i className="fi fi-rr-arrow-right"></i>
                  </span>
                  </div>
      
          
           
          </div>
        
        <div className="members-text">{Subscribers?.length} Members</div>
        
        <div className="search-container">
          <input className="search-input" placeholder="Search members" type="text"/>
          <i className="fas fa-search search-icon"></i>
        </div>
        
        <div className="members-list">
          {Subscribers?.map((subs:Account)=>(
 <div className="member">
 <img alt="Ahsan Pratama avatar" className="avatar" height="40"  src={`data:image/jpeg;base64,${subs?.accountProfileImage}`} width="40"/>
 <div className="member-info">
   <div className="member-name">{subs.accountName}</div>
   <div className="member-username"></div>
 </div>
</div>
          )

          )}
         
          
          
        </div>
      </div>
    );
}