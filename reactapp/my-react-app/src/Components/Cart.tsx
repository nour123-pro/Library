import React, { useState } from 'react';

export default function Cart({show,onClose}:{show:boolean,onClose:()=>void}) {
    // Sample cart data state (replace with your actual cart state management)
    const [cartItems, setCartItems] = useState([
        { id: 1, title: '1984', image: 'src/assets/images/book-10.png', quantity: 1, price: 15.99 },
        { id: 2, title: 'Animal Farm', image: 'src/assets/images/book-11.png', quantity: 1, price: 12.99 },
        { id: 3, title: 'Brave New World', image: 'src/assets/images/book-12.png', quantity: 1, price: 14.99 }
    ]);

    // Function to handle quantity changes
    const updateQuantity = (id:number, newQuantity:number) => {
        setCartItems(cartItems.map(item => 
            item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
        ));
    };

    // Function to remove item from cart
    const removeItem = (id:number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div id="cartPopup" className={` ${show ? "" : "hidden"}`} >
            <div className="CartDisplay">
            <div id="closeCart" className=" hover:text-gray-700 text-2xl" onClick={onClose}>&times;</div>
            <h4>Added to Cart <span className="CartIcon cartBtn">
                       
                <i className="fi fi-tr-books"></i>
             </span></h4>
                <div className='flexColumn'>


               
                <div className="ProductsAdded ">
                    {cartItems.length === 0 ? (
                        <p className="text-center py-4">Your cart is empty</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="ProductAdded ">
                                <div className="couple">
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        
                                    />
                                    <h6 className="font-medium">{item.title}</h6>
                                </div>
                                
                                
                                    <div className="quantity-controls">
                                        <div
                                            className="decrease-btn"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            ➖
                                        </div>
                                        <span className="quantity">{item.quantity}</span>
                                        <div 
                                            className="increase-btn"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            ➕
                                        </div>
                                    </div>
                                    
                                    
                                    
                                   
                                        <i className="fi fi-tr-circle-trash" style={{ fontSize: '20px',color:"red" }}  onClick={() => removeItem(item.id)}></i>
                                    
                                
                            </div>
                        ))
                    )}
                </div>
                <button className="btn btn-google text-uppercase fw-bold ">
                <i className="fab fa-google me-2"></i> Contimue
                        </button>
                </div>
                
                
                       
                    
            </div>
        </div>
    );
}