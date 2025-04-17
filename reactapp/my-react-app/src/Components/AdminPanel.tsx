import { useEffect, useState } from "react";
import Navbar from "./navbar";
import BookTables, { Book } from "./Table";
import axios from "axios";
import "../assets/css/AdminPanelcss.css"
import CategoryTable from "./CategoryTable";
import AuthorTable from "./AuthorTable";
import Chart from "./Chart";
import { PieChart } from "lucide-react";
import Charting from "./Charting";
import Example from "./UsersChart";

export default function  AdminPanel(){
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setSignUp] = useState(false);
    const [showCart, setCart] = useState(false)
    const[books,setbooks]=useState<Book[]>();
    const fetchBooks = async () => {
        const apiUrl = 'http://localhost:5000/api/Book/allbooks';
        
        try {
          const response = await axios.get<Book[]>(apiUrl, {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
          });
          setbooks(response.data);
        } catch (error) {
           console.log(error, 'Unable to load Books Data');
          return [];
        }
      };
    useEffect(()=>{
        fetchBooks();
    },[]);
     return(
        <div className="MainContainer">
        <Navbar 
        onLoginClick={() => setShowLogin(true)} 
        onCartClick={() => setCart(true)}  
      />
    
        < div className="nour"  >
        <h1 style={{fontSize:'40px',opacity:0.7,writingMode:'vertical-lr'}}>WELCOME ADMIN</h1>
     <Charting></Charting>
     <Example></Example>
    
     </div>
     < div className="flexrow2">
     <CategoryTable></CategoryTable>
      <AuthorTable></AuthorTable>
     
     </div>
      <BookTables books={books||[]}></BookTables>
    
     
     
      </div>
     );
};