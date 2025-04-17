
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import AuthProvider from './Components/AuthContext'
import Login from './Components/Login'
import MainPage from './Components/MainPage'
import './assets/css/style.css'
import SingleBookView from './Components/SingleBookView'
import UserProfile from './Components/UserProfile'
import ChatRoom from './Components/ChatRoom'
import { useEffect, useState } from 'react'
import Again from './Components/again'
import AdminPane from './Components/AdminPanel'
import AdminPanel from './Components/AdminPanel'

function App() {
  
  
   
  return (
    <>
    <Router>
    <AuthProvider>
      <Routes>
      <Route path='/' element={<MainPage/>} />
       
         <Route path='/Profile' element={<UserProfile />}></Route>
       
     
      <Route path='/Chat' element={<ChatRoom/>}></Route>
       <Route path='*' element={<MainPage/>}></Route>
       <Route path='/see' element={<Again/>}></Route>
       <Route path='/WelcomeAdmin' element={<AdminPanel/>}></Route>
      </Routes>
    
     
      
      </AuthProvider>
    </Router>
     
      
     
 
        
    </>
  )
}

export default App
