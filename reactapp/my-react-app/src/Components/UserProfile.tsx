import { useCallback, useEffect, useState } from "react";
import EditForm from "./EditForm";
import "../assets/css/style.css";

import "../assets/css/pro.css";
import "../assets/css/status.css"
import notificationIcon from "../assets/images/notification.png";
import ProgressBarComponent from "./ProgressBarComponent";
import CalendarComponent from "./Calender";
import axios from "axios";
import { Account, Book, BorrowedBook, User } from "./interfaces";
import { LoadingSpinner } from "./Loading";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Divide } from "lucide-react";
import Notifications from "./Notifications";
import Notificationss from "./AnotherNot";
export default function UserProfile() {
    const [showEditForm, setEditForm] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [account, setAccount] = useState<Account | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const[imageupdate,setnewimage]=useState<boolean>(false);
   const[Books,setBooks]=useState<Book[]|null>();
   const[ChatRooms,setChatRooms]=useState<string>('');
   const[comments,setcomments]=useState<string>('');
   const {usern,logout}=useAuth();
   const[BorrowedBooks,setBorrowedBooks]=useState<BorrowedBook[]|null>();
    const fetchUserInfo = useCallback(async (username: string) => {
        try {
            
            setError(null);
            
            
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");
            const url=`http://localhost:5000/api/user/AccountInfo?username=${username}`
            const response = await axios.get<Account>(`http://localhost:5000/api/user/AccountInfo`, {
              params: { username },
              headers: { 
                'Content-Type': 'application/json',
                
                'Accept': 'application/json'
              },
            });

            
            setAccount(response.data|| null);
            setUser(response.data.user);
        } catch (err) {
            const errorMessage = axios.isAxiosError(err) 
                ? err.response?.data?.message || "Request failed"
                : "An unexpected error occurred";
            setError(errorMessage);
            console.error('Error fetching user info:', err);
        } finally {
           
        }
    }, []);
    const BooksReadingByUser=(async(username:string)=>{
         try {
          const token = localStorage.getItem("token");
          const response = await axios.get<BorrowedBook[]>(`http://localhost:5000/api/BorrowedBooks/BorrowedBooksForAccount?accountname=${username}`, {
       
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          const updatedBooks = response.data.map(borrowed => ({
            ...borrowed,
            book: {
              ...borrowed.book,
              bookImages: [`data:image;base64,${borrowed.book.bookImages}`] // Convert to string[]
            }
          }));
          
          setBorrowedBooks(updatedBooks);
          
          
         } catch (error) {
          const errorMessage = axios.isAxiosError(error) 
          ? error.response?.data?.message || "Request failed while fetching reading book by user"
          : "Request failed while fetching reading book by user";
      setError(errorMessage);
      console.error('Error fetching user info:', error);
         }
    });
    const fetchCommentsforthisaccount=async (accountname:string)=>{
      
    
      const datasent = {
        accountname: accountname
      };
      const response = await axios.post("http://localhost:5000/api/Account/Comments",datasent, {
       
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

    
     setcomments(response.data);
     console.log("comments"+comments)
  
    };
    const[numberchatrooms,setChatRoomnumbers]=useState<string>();
    const fetchChatRoomsforthisaccount=async(accountname:string)=>{
     
      const datasent = {
        accountname: accountname
      };
      const response = await axios.post("http://localhost:5000/api/ChatAccount/GetNumberChatRoomsForAccount",datasent, {
       
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

    
     setChatRoomnumbers(response.data);
     console.log("comments"+comments)
  
    };
    useEffect(() => {
        const usernameFromStorage = localStorage.getItem("username");
       
        if (usernameFromStorage) {
          fetchCommentsforthisaccount(usernameFromStorage);
          fetchChatRoomsforthisaccount(usernameFromStorage);
            setUsername(usernameFromStorage);
            fetchUserInfo(usernameFromStorage);
            BooksReadingByUser(usernameFromStorage);
            
            
        } else {
            setLoading(false);
            setError("No username found in storage");
           
        }
      
    }, []);
    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }
    if(!user ){
      return <div>No user found for this username {user}</div>
    }
    if (!account && user!=null) {
        return <div>No profile data found {username}</div>;
    }
    else if(!user){
      return <div  >No user found for this username</div>
    }
   
      
      

    return (
      <>
  {loading ? (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <LoadingSpinner></LoadingSpinner>
    </div>
  ) : (
    <div className="Content">
      <div className="LeftSide">
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
                  <Link to="/chat">
                  <span className="nav-label">ChatRoom</span>
                  </Link>
                 
                </a>
                <span className="nav-tooltip">Notifications</span>
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
      </div>

      <div className="RightSide">
        <div className="parent">
          <div className="div1">
            <span className="div1Text">
              <h1>Hey {localStorage.getItem("username") || 'User'} 🌻</h1>
              <br />
              You have    
          {username?(
            <>
           
              <Notifications accountname={username} ></Notifications>
              
              </>
          ):(
""
          )} Alerts
           
            </span>
            <div id="container">
              {BorrowedBooks && (
                <ProgressBarComponent numberbookread={BorrowedBooks?.length.toString() || '0'} />
              )}
            </div>
            
           
          </div>

          <div className="div2">
            {BorrowedBooks && (
              <CalendarComponent BorrowedBookss={BorrowedBooks} />
            )}
          </div>

          <div className="div4 stuffonshelf"  >
            <span className="div4text">Currently Reading</span>
            <div className="booksOnShelf ">
           
              <div className="books">
              {BorrowedBooks?.map((bb) => {
  const base64String = bb.book?.bookImages?.[0] || "";
  const base64Data = base64String.split(',')[1] || base64String;
  const cleaned = base64Data.replace(/[^A-Za-z0-9+/=]/g, '');

  return (
    <div key={bb.bookId} style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      marginTop: '22px',
    
      position: 'relative'
    }}>
      <img
        src={`data:image/jpeg;base64,${cleaned}`}
        style={{
          width: '280px',
          height: 'auto',
          maxHeight: '100%',
          objectFit: 'contain'
        }}
        alt={bb.book?.bookName || "Book cover"}
        onError={(e) => {
          e.currentTarget.src = 'src/assets/images/book-11.png';
          e.currentTarget.style.width = '280px';
          e.currentTarget.style.height = 'auto';
        }}
      />
    </div>
  );
})}
</div>
              <img className="shelf" />
              </div>
            <span className="BookRead"></span>
          </div>
          

          <div className="options">
          <div className="card2 second-card">
  <div className="card-content">
    <p className="location"></p>
    
    <h1 className="degree">
      {BorrowedBooks?.length}
      <sup>o</sup>  
      <i className="fi fi-tr-piggy-bank"></i>
    </h1>
    
    <p className="weather-status">POINTS</p>
  </div>
           </div>

           <div className="card2 second-card">
  <div className="card-content">
    <p className="location"></p>
    
    <h1 className="degree">
      {comments}
      <sup>o</sup>  
      <i className="fi fi-tr-comments"></i>
    </h1>
    
    <p className="weather-status">Comments</p>
  </div>
</div>
<div className="card2 second-card">
  <div className="card-content">
    <p className="location"></p>
    
    <h1 className="degree">
      {numberchatrooms}
      <sup>o</sup>  
      <i className="fi fi-ts-population-globe"></i>
    </h1>
    
    <p className="weather-status">ChatRooms</p>
  </div>
</div>


       
          </div>
        </div>
      </div>

      <EditForm
         setimagenew={() => setnewimage(true)}
        show={showEditForm}
        onClose={({ newusername }: { newusername: string }) => { setEditForm(false); fetchUserInfo(newusername); }}
        oldusername={username}
        account={account}
       
      />
    </div>
  )}
</>
      );
};
