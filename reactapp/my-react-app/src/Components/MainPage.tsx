import { useState } from "react";
import Books from "./Books";
import BooksMenu from "./BooksMenu";
import Footer from "./Footer";
import Hero from "./Hero";
import LoginForm from "./LoginForm";
import Words from "./Words";
import Navbar from "./navbar";
import SingleBook from "./SingleBook";
import SignIn from "./SignIn";
import Cart from "./Cart";
import SingleBookView from "./SingleBookView";
import { Book } from "./interfaces";

export default function MainPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setSignUp] = useState(false);
  const [showCart, setCart] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <div className="MainPage" >
      {selectedBook ? (
        // Show only SingleBookView when a book is selected
        <SingleBookView 
          book={selectedBook} 
          onBack={() => setSelectedBook(null)}
        />
      ) : (
        // Show normal layout when no book is selected
        <>
          <Navbar 
            onLoginClick={() => setShowLogin(true)} 
            onCartClick={() => setCart(true)}  
          />
          <LoginForm 
            show={showLogin} 
            onClose={() => setShowLogin(false)}  
            onSignUpClick={() => setSignUp(true)}  
          />
          <SignIn show={showSignUp} onClose={() => setSignUp(false)} />
          <Cart show={showCart} onClose={() => setCart(false)} />
          <Hero />
          <Books />
          <Words />
          <BooksMenu onBookSelect={setSelectedBook} />
          <Footer />
          
        </>
      )}
    </div>
  );
}