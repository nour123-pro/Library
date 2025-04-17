
import '../assets/css/hope.css';

import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import { Account, ChatMessage, ChatRoom } from './interfaces';
import axios from 'axios';
import RightChatRoomComponent from './RightChatRoomComponent';
import ChatComponent from './ChatComponent';
 // Make sure to import your Navbar component




export default function ChatApp() {
  const[chatrooms,setchatrooms]=useState<ChatRoom[]>([])
  const[currentaccount,setcurrentaccount]=useState<Account|null>(null);
  const[chatmessages,setchatmessages]=useState<ChatMessage |null>(null);
  const[selectedchatroomid,setselectedchatroomid]=useState<string>('');
  const[selectedchatroom,setselectedchatroom]=useState<ChatRoom|null>(null);
  const[updaterightsidebar,setupdaterightbar]=useState<boolean>(false);
  const[username,setusername]=useState<string>('');
 const fetchingchatrooms=async ()=>{
  
   const apiUrl = 'http://localhost:5000/api/ChatRooms/AllChatRooms';
  
 
   try {
     // Correct axios syntax
     const response = await axios.get<ChatRoom[]>(apiUrl,{
       headers: { 
         'Content-Type': 'application/json' ,
         'Accept': 'application/json'
       },
       // withCredentials: true // Uncomment if using cookies
     });
 
     // Axios wraps the response in a 'data' property
     if (response.data) {
      
       setchatrooms(response.data);
       setselectedchatroom(response.data?.[0]);
       console.log("ia m here"+response.data);
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
 const fetchChatRoomById=async ()=>{
  const apiUrl = 'http://localhost:5000/api/ChatRooms/GetChatRoom';
  const requestdata={
    selectedchatroomid
  }
 
  try {
    // Correct axios syntax
    const response = await axios.post<ChatRoom>(apiUrl,requestdata,{
      headers: { 
        'Content-Type': 'application/json' ,
        'Accept': 'application/json'
      },
      // withCredentials: true // Uncomment if using cookies
    });

    // Axios wraps the response in a 'data' property
    if (response.data) {
     
      setselectedchatroom(response.data);
      console.log("ia m here"+response.data);
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
 const fetchAccount=async(usernamee:string)=>{
  const apiUrl = `http://localhost:5000/api/user/AccountInfo?username=${usernamee}`;
 
 
  try {
    // Correct axios syntax
    const response = await axios.get<Account>(apiUrl,{
      headers: { 
        'Content-Type': 'application/json' ,
        'Accept': 'application/json'
      },
      // withCredentials: true // Uncomment if using cookies
    });

    // Axios wraps the response in a 'data' property
    if (response.data) {
     setcurrentaccount(response.data);
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
 useEffect(()=>{
    const username=localStorage.getItem("username");
    if(username!=null){
      setusername(username);
       fetchAccount(username);
    
    }
   
    const loaddata=async()=>{
      try {
        await fetchingchatrooms();
       
      } catch (error) {
        console.log(error);
      }
    }
    loaddata();

    
 },[]);
  return (
    <div className='big' >
      <Navbar onLoginClick={function (): void {
        throw new Error('Function not implemented.');
      } } onCartClick={function (): void {
        throw new Error('Function not implemented.');
      } } />
      <div  className="w-[100%] flex flex-end justify-center align-center h-[100vh] border-4 border-[black] rounded-2xl" id="ChatContainer">
        
        {/* Left Sidebar */}
        <div className="leftsidebarchat">
    <div className="flex-item mb-4">
        <div className="IconDiv">
            <i className="fi fi-ts-arrow-left-from-arc" ></i>
        </div>
        <div>
            <div className="font-semibold"></div>
            <div className="text-sm text-gray-500">
              {username?(
                   `Welcome ${username}`
              ):(
              <p>Welcome</p>
              )}
              
            </div>
        </div>
    </div>

    <div className="search-container">
        <input className="search-input" placeholder="Search message" type="text" />
        <i className="fas fa-search search-icon"></i>
    </div>

    <div className="message-container">
    <div className="message-list-container">
  {chatrooms && chatrooms.length > 0 ? (
    chatrooms.map((chatroom: ChatRoom) => (
      <div 
  className={`message-item ${selectedchatroomid === chatroom.chatRoomId ? 'selected' : ''}`} 
  key={chatroom.chatRoomId} 
  onClick={() => {
    const newId = selectedchatroomid !== chatroom.chatRoomId 
      ? chatroom.chatRoomId 
      : '';
    setselectedchatroomid(newId);
    if (newId) {
      setselectedchatroom(chatroom);
    } else {
      setselectedchatroom(null);
    }
  }}
>
        <img 
          alt={chatroom.chatRoomName} 
          className="rounded-img" 
          src={chatroom?.chatRoomImage ? `data:image/jpeg;base64,${chatroom?.chatRoomImage}` : 'src/assets/images/book-12.png'}
          
        />
        
        <div className="message-content">
          <div className="message-title">📖 {chatroom.chatRoomName}</div>
          <div className="message-description">
            🏔️ {chatroom.chatRoomDescription}
          </div>
        </div>
        
        <div className="message-meta" style={{display:'flex',flexDirection:'column'}}>
          <span className="message-time">
            {new Date(chatroom.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <i className="fas fa-comments text-gray-400"></i>
        </div>
      </div>
    ))
  ) : (
    <div className="text-center py-4 text-gray-500">
      No chat rooms available
    </div>
  )}
</div>

        

       
    </div>
</div>

        
        {/* Main Chat Area */}
        {currentaccount?(
          <ChatComponent chatroomid={selectedchatroomid} account={currentaccount}></ChatComponent>
        ):

        <div className='mainchatarea' style={{display:"flex",justifyContent:"center",alignItems:"center"}}>

<main>
	<svg className="ip" viewBox="0 0 256 128" width="256px" height="128px" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0%" stop-color="#5ebd3e" />
				<stop offset="33%" stop-color="#ffb900" />
				<stop offset="67%" stop-color="#f78200" />
				<stop offset="100%" stop-color="#e23838" />
			</linearGradient>
			<linearGradient id="grad2" x1="1" y1="0" x2="0" y2="0">
				<stop offset="0%" stop-color="#e23838" />
				<stop offset="33%" stop-color="#973999" />
				<stop offset="67%" stop-color="#009cdf" />
				<stop offset="100%" stop-color="#5ebd3e" />
			</linearGradient>
		</defs>
		<g fill="none" stroke-linecap="round" stroke-width="16">
			<g className="ip__track" stroke="#ddd">
				<path d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56"/>
				<path d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64"/>
			</g>
			<g stroke-dasharray="180 656">
				<path className="ip__worm1" stroke="url(#grad1)" stroke-dashoffset="0" d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56"/>
				<path className="ip__worm2" stroke="url(#grad2)" stroke-dashoffset="358" d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64"/>
			</g>
		</g>
	</svg>
</main>
        </div>
        }
    

        
        {/* Right Sidebar */}
        {selectedchatroom?(
          <RightChatRoomComponent selectedchatroom={selectedchatroom} usernamee={username}></RightChatRoomComponent>
        ):(
          <div  className="right-sidebar">
             <p>Click on an chat room to view more details</p>
          </div>
          
        )};
       

      </div>
    </div>
  );
};

