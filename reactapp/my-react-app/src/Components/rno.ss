
import '../assets/css/ch.css';
import '../assets/css/style.css';
import { FaSearch, FaComments, FaPaperPlane } from 'react-icons/fa';
import Navbar from './navbar';
import { Account, Book, BorrowedBook, User } from "./interfaces";
import { LoadingSpinner } from "./Loading";
import { Link } from "react-router-dom";
import { useState } from 'react';
import { useAuth } from './AuthContext';
import ChatComponent from './ChatComponent';
export default function ChatRoom() {
  const [showEditForm, setEditForm] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [account, setAccount] = useState<Account | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
 const[Books,setBooks]=useState<Book[]|null>();
 const {usern,logout}=useAuth();
 const[BorrowedBooks,setBorrowedBooks]=useState<BorrowedBook[]|null>();
  return (
    <div className='biggest'>
    
    <Navbar></Navbar>
    <div className='big'>
    <aside className="sidebar">
                  <header className="sidebar-header">
                    <a href="#" className="header-logo">
                      <div style={{ width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden' }}>
                        <img
                          src={`data:image/jpeg;base64,${account?.accountProfileImage}`}
                          alt="Profile"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    </a>
                    <button className="toggler sidebar-toggler">
                      <span className="material-symbols-rounded">chevron_left</span>
                    </button>
                    <button className="toggler menu-toggler">
                      <span className="material-symbols-rounded">menu</span>
                    </button>
                  </header>
    
                  <nav className="sidebar-nav">
                    <ul className="nav-list primary-nav">
                      <li className="nav-item">
                        <a href="#" className="nav-link">
                          <Link to="/">
                            <span className="nav-icon material-symbols-rounded">dashboard</span>
                          </Link>
                          <span className="nav-label">Dashboard</span>
                        </a>
                        <span className="nav-tooltip">Dashboard</span>
                      </li>
                      <li className="nav-item">
                        <a href="chat.html" className="nav-link">
                          <span className="nav-icon material-symbols-rounded">notifications</span>
                          <span className="nav-label">ChatRoom</span>
                        </a>
                        <span className="nav-tooltip">Notifications</span>
                      </li>
                      <li className="nav-item">
                        <a href="#" className="nav-link">
                          <span className="nav-icon material-symbols-rounded">star</span>
                          <span className="nav-label">Save To Read</span>
                        </a>
                        <span className="nav-tooltip">Bookmarks</span>
                      </li>
                      <li className="nav-item">
                        <a href="#" className="nav-link">
                          <span className="nav-icon material-symbols-rounded">settings</span>
                          <span className="nav-label" onClick={() => setEditForm(true)}>Settings</span>
                        </a>
                      </li>
                    </ul>
                    <ul className="nav-list">
                      <li className="nav-item">
                        <a href="#" className="nav-link">
                          <span className="nav-icon material-symbols-rounded">account_circle</span>
                          <span className="nav-label">Profile</span>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="#" className="nav-link">
                          <span className="nav-icon material-symbols-rounded">logout</span>
                          <Link to="/">
                            <span className="nav-label" onClick={logout}>Logout</span>
                          </Link>
                        </a>
                        <span className="nav-tooltip">Logout</span>
                      </li>
                    </ul>
                  </nav>
                </aside>
   
    <div id="ChatContainer" className=" flex justify-center items-center  border-4 border-pink rounded-2xl">
      {/* Left Sidebar */}
      <div className="leftsidebar">
  <div className="header">
    <div className="icon">
      <i className="fi fi-ts-arrow-left-from-arc text-gray-400"></i>
    </div>
    <div className="info">
      <div className="welcome">Welcome Ahsan Pratama</div>
      <div className="subtext text-sm text-gray-500">Welcome Ahsan Pratama</div>
    </div>
  </div>

  <div className="search-container">
    <input 
      className="search-input" 
      placeholder="Search message" 
      type="text" 
    />
    <FaSearch className="search-icon" />
  </div>

  <div className="chat-list">
    <div className="chat-item">
      <img 
        alt="The Hobbit Cover" 
        className="chat-item-img" 
        src="./images/book-11.png" 
      />
      <div className="chat-details">
        <div className="title">📖 The Hobbit</div>
        <div className="description text-sm text-gray-300">
          🏔️ A community discussing Middle-earth adventures!
        </div>
      </div>
      <div className="chat-time">
        12:57 <FaComments className="icon ml-2 inline" />
      </div>
    </div>

    <div className="chat-item">
      <img 
        alt="The Hobbit Cover" 
        className="chat-item-img" 
        src="./images/book-12.png" 
      />
      <div className="chat-details">
        <div className="title">📖 The Hobbit</div>
        <div className="description text-sm text-gray-300">
          🏔️ A community discussing Middle-earth adventures!
        </div>
      </div>
      <div className="chat-time">
        12:57 <FaComments className="icon ml-2 inline" />
      </div>
    </div>
  </div>
</div>

      
      {/* Main Chat Area */}
  <ChatComponent></ChatComponent>

      
      {/* Right Sidebar */}
      <div className="rightsidebar">
    <div className="group-avatar mb-4">
        <img 
            alt="Group avatar" 
            className="avatar" 
            src="src/assets/images/book-6.png" 
        />
        <div className="group-info">
            <div className="group-name">Dribbble & Behance Familia 🏀</div>
            <div className="group-members">1232 Members • 200 Online</div>
        </div>
    </div>

    <div className="flex flex-row  mb-4 justify-center gap-[5%]">
        
         <div className="ButtonMute">
            <i className="fi fi-tr-music-note-slash"></i>
            <span>Unmute</span>
         </div>

         <div className="ButtonMute">
            <i className="fi fi-ss-leave"></i>
            <span>Leave</span>
         </div>



           
              
              
              
        
    
      
    
        
    </div>
    
    <div className="space-y-4 mb-4">
     <div className="ButtonShape">
      <span>
        <i className="fi fi-ts-book-open-cover"></i>
      Book Name
      </span>
      <span className="text-gray-500">
       Alice in WonderLand
       <i className="fi fi-rr-arrow-right"></i>
      </span>
      </div>
      <div className="ButtonShape">
        
        <span>
         
            <i className="fi fi-rr-copyright"></i>
        Author
        </span>
        <span className="text-gray-500">
         Harrry Poter
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
    <div className="text-gray-500 mb-4">
     1232 Members
    </div>
    <div className="relative mb-4">
     <input className="w-full p-2 pl-10 border rounded-[23px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F5F8FA]" placeholder="Search members" type="text"/>
     <i className="fas fa-search absolute left-3 top-3 text-gray-400">
     </i>
    </div>
    <div className="overflow-y-auto flex-1">
     <div className="flex items-center mb-4">
      <img alt="Ahsan Pratama avatar" className="rounded-full mr-3" height="40" src="https://placehold.co/40x40" width="40"/>
      <div>
       <div className="text-sm text-gray-600">
        Ahsan Pratama
       </div>
       <div className="text-sm text-gray-400">
        @ahsanpratamaa
       </div>
      </div>
     </div>


     <div className="flex items-center mb-4">
        <img alt="Ahsan Pratama avatar" className="rounded-full mr-3" height="40" src="https://placehold.co/40x40" width="40"/>
        <div>
         <div className="text-sm text-gray-600">
          Ahsan Pratama
         </div>
         <div className="text-sm text-gray-400">
          @ahsanpratamaa
         </div>
        </div>
       </div>
   
   
   
   
    </div>
    


    

    

    
</div>


      <script src="https://cdn.tailwindcss.com"></script>
    </div>
    </div>
    </div>
  );
}