import { useState } from "react";
import LoginForm from "./LoginForm";
import SingleBook from "./SingleBook";
import Navbar from "./navbar";
import SignIn from "./SignIn";
import { Book } from "./interfaces";
interface SingleBookViewProps {
    book: Book;
    onBack: () => void;
  }
export default function SingleBookView({ book, onBack }: SingleBookViewProps) {
    const [showLogin, setShowLogin] = useState(false);
    
  const[showSignUp,setSignUp]=useState(false);
  const[showCart,setCart]=useState(false);
    return(
        <>
         <Navbar onLoginClick={() => setShowLogin(true)} onCartClick={()=>setCart(true)} />
         <LoginForm show={showLogin} 
    onClose={() => setShowLogin(false)}  
    onSignUpClick={() => setSignUp(true)}  />
    <SignIn show={showSignUp} onClose={()=>setSignUp(false)}></SignIn>
    
        <SingleBook bookwanted={book} OpenBorrowForm={false}></SingleBook>
        </>
       
    );
}