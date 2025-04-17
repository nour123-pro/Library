import React, { useEffect, useState } from 'react';
import '../assets/css/ChatComponentcss.css'
import { Account, ChatMessage } from './interfaces';
import axios from 'axios';
import { message } from 'antd';
import { useStyleRegister } from 'antd/es/theme/internal';
const ChatComponent = ({chatroomid,account}:{chatroomid:string,account:Account}) => {
  const[messages,setmessages]= useState<ChatMessage[]>();
  const[newmessage,setnewmessage]=useState<string>('');
  const[showbutton,setshowbutton]=useState<boolean>(false);
  const fetchmessages=async ()=>{
    const apiUrl = 'http://localhost:5000/api/ChatMessages/Messages';
    
    const requestdata={
      chatroomid,
     
    }
    
    
    try {
      // Correct axios syntax
      const response = await axios.post<ChatMessage[]>(apiUrl,requestdata,{
        headers: { 
          'Content-Type': 'application/json' ,
          'Accept': 'application/json'
        },
        // withCredentials: true // Uncomment if using cookies
      });
     
      // Axios wraps the response in a 'data' property
      if (response?.data) {
        try {
         setmessages(response?.data);
         
        } catch (error) {
         console.log("Error processing response:"+response.data);
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

  const sendingMessage=async ()=>{
    const apiUrl = 'http://localhost:5000/api/ChatMessages/AddMessage';
    const accountid=account.accountId;
    const content=newmessage;
    const date=new Date().toString();
    const requestdata={
      chatroomid,
      accountid,
      content,
      date
     
    }
    
    
    try {
    
      const response = await axios.post(apiUrl,requestdata,{
        headers: { 
          'Content-Type': 'application/json' ,
          'Accept': 'application/json'
        },
       
      });
     
      
      if (response?.data) {
        try {
          if(response.data.success=="true"){
         
            setnewmessage('');
          }else{
            alert("error:"+response.data);
          }
         fetchmessages();
         
        } catch (error) {
         console.log("Error processing response:"+response.data);
        }
      }
  
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
       
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
   
    const username=account.accountName;
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
          setshowbutton(Enrolled);
          
         
        } catch (error) {
          alert("Error processing response:"+response.data.enrolled);
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
  useEffect(()=>{
     fetchmessages();
     IsEnrolledInChatRoom();
  },[chatroomid]);
  
  return (
    <div className='mainchatarea'>
      <div className='--dark-theme' id="chat">
        <div className="chat__conversation-board">
          {messages?.map((message: ChatMessage) => (
            <div key={message.id} className={`chat__conversation-board__message-container ${message.chatAccount.account?.accountId === account.accountId ? 'reversed' : ''}`}>
              <div className="chat__conversation-board__message__person">
                <div className="chat__conversation-board__message__person__avatar">
                  <img 
                    src={`data:image/jpeg;base64,${message.chatAccount.account?.accountProfileImage}`} 
                    alt="Profile" 
                  />
                </div>
                <span className="chat__conversation-board__message__person__nickname">
                  {message.chatAccount.account?.accountName}
                </span>
              </div>
              
              <div className={`chat__conversation-board__message__context ${message.chatAccount.account?.accountId === account.accountId ? 'purple' : ''}`}>
                <span className='message-date'>{message.createdAt}</span>
                <div className="chat__conversation-board__message__bubble">
                  <span>{message.content}</span>
                </div>
              </div>
              
              <div className="chat__conversation-board__message__options">
                <button className="btn-icon chat__conversation-board__message__option-button option-item emoji-button">
                  <svg className="feather feather-smile sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </button>
                
                <button className="btn-icon chat__conversation-board__message__option-button option-item more-button">
                  <svg className="feather feather-more-horizontal sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
  
        {/* Chat input panel */}
        <div className="chat__conversation-panel">
          <div className="chat__conversation-panel__container">
            <button className="chat__conversation-panel__button panel-item btn-icon add-file-button">
              <svg className="feather feather-plus sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            
            <button className="chat__conversation-panel__button panel-item btn-icon emoji-button">
              <svg className="feather feather-smile sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </button>
            
            <input 
              className="chat__conversation-panel__input panel-item" 
              placeholder="Type a message..." 
              onChange={(e) => setnewmessage(e.target.value)} 
              value={newmessage}
            />
            
            <button 
              className="chat__conversation-panel__button panel-item btn-icon send-message-button" 
              style={{ 
                opacity: showbutton ? '1' : '0.1', 
                pointerEvents: showbutton ? 'auto' : 'none' 
              }}
              onClick={sendingMessage}
              onMouseEnter={(e) => e.currentTarget.classList.add('loading')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('loading')}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                aria-hidden="true"
                className="send-icon"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;