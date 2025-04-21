import "../assets/css/style.css";
import "../assets/css/singleBook.css";
import { Book, BorrowedBook } from "./interfaces";
import { Comment } from "./interfaces";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Heart, HeartIcon } from "lucide-react";
import BorrowingForm from "./BorrowingForm";
import { useFetcher, useFormAction } from "react-router-dom";
import ConfirmDeleteComment from "./ConfirmDeleteComment";
import RatingBook from "./RatingBook";
import BookSearch from "./BookSearchAutocomplete";
import { BiPackage } from "react-icons/bi";
interface SingleBookProps {
  bookwanted: Book;
  OpenBorrowForm:boolean
}

export default function SingleBook({ bookwanted,OpenBorrowForm }: SingleBookProps) {
  const[accountname,setaccountname]=useState<string>('');
  const [Comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const[liked,setliked]=useState<boolean>();
  const[prevbook,setprevbook]=useState();
  const[nextbook,setnextbook]=useState();
  const[duedate,setduedate]=useState();
  const[isPopupBorrowShown,setPopBorrow]=useState(false);
  const[newcomment,setnewcomment]=useState<string>('');
  const[DeleteComment,setCofirmDeleteComment]=useState(false);
  const[currentbook,setcurrentbook]=useState<Book>()
 const[isAvailable,setAvailiablity]=useState<boolean>(false);
 const[nextavialble,setnextavailabletime]=useState<string>('');
  const fetchComments = useCallback(async (bookId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = `http://localhost:5000/api/Comment/CommentsForBook?Bookid=${bookId}`;
      const response = await axios.get<Comment[]>(apiUrl, {
        headers: { 
          'Accept': 'application/json'
        },
      });
      setComments(response.data as Comment[]);

    } catch (error) {
      let errorMessage = 'Failed to load comments';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                      error.response?.statusText || 
                      error.message;
      }
      setError(errorMessage);
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    
    const username = localStorage.getItem("username");
    const commenttext = newcomment.trim();
    const bookid = bookwanted.bookId;
  
    // Validate inputs
    if (!commenttext) {
      alert("Comment cannot be empty");
      return;
    }
    if (!username) {
      alert("You must be logged in to comment");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/Comment/AddingNewComment",
        {
          bookid,
          username,
          commenttext
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
  
      if (response.data.message) {
        alert(response.data.message);
        fetchComments(bookwanted.bookId);
        console.log("done");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response?.data;
        if (serverResponse?.errors) {
          alert(serverResponse.errors.join('\n'));
        } 
        else if (serverResponse?.message) {
          alert("help"+serverResponse.message);
        }
        else {
          alert(error.response?.statusText || 'Failed to submit comment. Please try again.');
        }
      } else {
        alert("An unexpected error occurred");
        console.error(error);
      }
    }
  };
  

  const searching=async()=>{
    
  };

  const checkingavai=async ()=>{
    try {
      const response = await axios.get(
        `http://localhost:5000/api/BorrowedBooks/Check?bookid=${bookwanted.bookId}`,
       
        {
          headers: {
            'Content-Type': 'application/json',
             'Accept': 'application/json'
          }
        }
      );
  
     
       
        var Available=response.data.isAvailable;
       
        setAvailiablity(Available);
        var nextavailable=response.data.nextAvailability;
        setnextavailabletime(nextavailable);
        console.log("done");
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response?.data;
        if (serverResponse?.errors) {
          alert(serverResponse.errors.join('\n'));
        } 
        else if (serverResponse?.message) {
          alert("help"+serverResponse.message);
        }
        else {
          alert(error.response?.statusText || 'Failed to check Available status. Please try again.');
        }
      } else {
        alert("An unexpected error occurred");
        console.error(error);
      }
    }
  }
 useEffect(() => {
  const checkAvailability = async () => {
    await checkingavai();
  };
  checkAvailability();
 }, [bookwanted]);
  useEffect( () => {
    const accountname=localStorage.getItem("username");
    if(accountname!=null){
      setaccountname(accountname);
    }
    if (bookwanted?.bookId) {
      fetchComments(bookwanted.bookId);
      
    }

  }, [bookwanted?.bookId, fetchComments]);
    

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
    <div style={{display:"flex",flexDirection:"column"}}>
     
      
      <BookSearch ></BookSearch>
      <div className="BookContent flexColumn">
     
        <div className="flexRow firstt">
          <div className="buttons">
            <div className="buttonUp">
              <i className="fi fi-ts-arrow-circle-up" ></i>
            </div>
            <div className="buttondown">
              <i className="fi fi-ts-arrow-circle-down" ></i>
            </div>
          </div>
         
             {bookwanted.bookImages?(
  <img 
  src={`data:image/jpeg;base64,${bookwanted.bookImages}`} 
  alt={bookwanted.bookName} 
  style={{"width":"20%"}}  

  ></img>
              ):(
<img src= 'src/assets/images/book-14.png' alt="" />
              )};
          <div className="flexColumn BookData">
            <h1 className="TextTitle">{bookwanted.bookName}</h1>
            <p>{bookwanted.author?.authorName}</p>
            <p>{bookwanted.bookDescription}</p>
            <div className="flexRow BookOptions">
              {isAvailable?(
                   <div className="ReadButton" onClick={()=>setPopBorrow(true)}>Read <span>
                   <i className="fi fi-ts-diary-bookmark-down"></i>
                 </span></div>
              ):(
                <>
                <div className="ReadButton" style={{ textAlign: 'center', whiteSpace: 'nowrap',width:'fit-content',height:'fit-content' ,padding:'10px'}}>Not available to Read <span>
                <i className="fi fi-ts-diary-bookmark-down"></i>
              </span></div>
               <div className="ReadButton" style={{ textAlign: 'center', whiteSpace: 'nowrap',width:'fit-content',height:'fit-content' ,padding:'10px',backgroundColor:'rgba(255, 0, 0, 0.3)'}}>Available at:{nextavialble}<span>
               <i className="fi fi-ts-diary-bookmark-down"></i>
             </span></div>
             </>
              )};
            
              <div className="Options">
                <div className="option">
                  <i className="fi fi-tc-bookmark"></i>
                </div>
                <div className="option">
                  <i className="fi fi-rr-heart " onClick={()=>{
                     setliked(!liked)
                     console.log("clicked liked");
                  }} 
                  style={{
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    fill: liked?'#ef4444' : '#9ca3af',
                    color: liked ?  '#ef4444' : '#9ca3af',
                  }}
                  ></i>
                </div>
                <div className="option">
                  <i className="fi fi-ss-download"></i>
                </div>
                {liked ? (
  <Heart fill="#ef4444" color="#ef4444" onClick={() => setliked(false)} />
) : (
  <HeartIcon color="#9ca3af" onClick={() => {setliked(true) ; 
                                          alert("you liked book");}} />
)}
              </div>
            </div>
          </div>
        </div>

        <div className="flexRow Seconddd" >
          <div className="Group1">
            <div className="Description">
              <h2>Description <i className="fi fi-tr-description-alt"></i></h2>
              <p>
              {bookwanted.bookDescription}
              </p>
            </div>
            <span className="wa" style={{ display: "flex" }}>
              <h3>Rating</h3>
              <RatingBook bookid={bookwanted.bookId}></RatingBook>
            </span>
            <div className="flexColumn Comments">
              <span style={{ display: "flex" }}>
                <h3>Comments</h3>
                <i className="fi fi-tc-comment-alt" style={{ color: "var(--gray2)" }}></i>
              </span>
              {/* Fixed: Added proper key prop to each comment */}
              {Comments?.map((comment) => (
                <>
                  <ConfirmDeleteComment show={DeleteComment} onClose={()=>{setCofirmDeleteComment(false); fetchComments(bookwanted.bookId);}} commentid={comment.commentId.toString()}></ConfirmDeleteComment>
                
              
                <div key={comment.commentId} className="Comment">
                
                  <div className="flexrow">
                  <div className="Row">
                    <span className="CommentImage">
                    
                        <div  style={{ width: 30, height: "auto",fontSize:20,display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",backgroundColor:"ghostwhite",borderRadius:"50%",color:"brown",border:"1px solid black" }}>
                            
  {comment.borrowedBook?.account?.accountName.charAt(0)}
</div>
                       

                    </span>
                    <span className="CommentAccountName">
                      {comment.borrowedBook?.account?.accountName || "Anonymous"}
                    </span>
                    
                  </div>
                    {comment.borrowedBook?.account?.accountName === accountname ? (
                      <span onClick={() => { setCofirmDeleteComment(true); }}>
                        <i className="fi fi-tr-circle-ellipsis-vertical"></i>
                      </span>
                    ) : (
                      null
                    )}
                 
                  </div>
                
                  
                  <span className="CommentContent">
                    {comment.commentContent}
                  </span>
                 
                  
                </div>
                </>
              ))}
             
            </div>

            <div >
              <form onSubmit={handleSubmit} className="Comments"  style={{ display: "flex",justifyContent:"center",alignItems:"center",flexDirection:"column" }}>
              <span>
              <h3>Your turn to write? <i className="fa fa-pen"></i></h3>
               
              </span>
               
                <input type="text"  placeholder="Whats your thoughts about book?" style={{border:"none",outline:"none"}} onChange={(e)=>{setnewcomment(e.target.value)}}/>
                <button type="submit" className="button-17">
                    Send
  </button>
              </form>
            </div>
          </div>

          <div className="Group2">
            <div className="Grouped Authors">
              <span style={{ display: "flex" }}>
                <h3>Author</h3>
                <i className="fi fi-rr-copyright" style={{ color: "var(--gray2)" }}></i>
              </span>
              <p>{bookwanted.author?.authorName}</p>
            </div>
            <div className="Grouped Language">
              <span style={{ display: "flex" }}>
                <h3>Language</h3>
                <i className="fi fi-ts-language" style={{ color: "var(--gray2)" }}></i>
              </span>
              <p>English</p>
            </div>
            <div className="Grouped Paperback">
              <span style={{ display: "flex" }}>
                <h3>Paperback</h3>
                <i className="fi fi-ts-document" style={{ color: "var(--gray2)" }}></i>
              </span>
              <p>Paper textured, full color, 345 pages<br />ISBN: 987 3 32564 455 B</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BorrowingForm show={isPopupBorrowShown} onClose={()=>setPopBorrow(false)} bookidwanted={bookwanted.bookId} book={bookwanted}></BorrowingForm> 
    
    </>
);
}