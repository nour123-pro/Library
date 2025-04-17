import axios from "axios";
import { useEffect, useState } from "react";
import{Link, useNavigate} from "react-router-dom";
import { useAuth } from "./AuthContext";
import AnimatedSignature from "./AnimatedSignature";
import { Book } from "./interfaces";

export default function BorrowingForm({ show, onClose,bookidwanted,book }: { show: boolean; onClose: () => void,bookidwanted:string,book:Book }) {
  const [bookid,setbookid]=useState<string>();
  const[returningdate,setreturningdate]=useState<string>('');
  const[accountname,setAccountname]=useState<string>();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    
   
    const requestData = {
      returningdate,
      bookid,
      accountname
    };
    const apiUrl = `http://localhost:5000/api/BorrowedBooks/ConfirmBorrowingBook?bookid=${bookid}&accountname=${accountname}&returningdate=${returningdate}`;
    

    try {
     
      const response = await axios.get(apiUrl,{
        headers: { 
          'Content-Type': 'application/json' ,
         
        },
       
      });

      
      if (response.data.message) {
        alert(response.data.message);
        onClose();
        
    }

      
      
      
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
       
        const serverResponse = error.response?.data;
                if (serverResponse?.errors) {
                    alert(serverResponse.errors.join('\n'));
                } 
                else if (serverResponse?.message) {
                    alert(serverResponse.message);
                }
                else {
                    alert(error.response?.statusText || 'confirmation failed?try again');
                }
      } else {
        alert("error:"+error);
      }
    }
  };
  useEffect( ()=>{
    const acccountname=localStorage.getItem("username");
    if(acccountname){
      setAccountname(acccountname);
    }
    setbookid(book.bookId);

   
  })
 

  return (
    <div className={`LoginForm ${show ? "show" : ""}`}>
      <div>{}</div>
      <div className="row w-full">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="close-btn" onClick={onClose}>✖</div>
            <div className="card-body d-flex flex-column">
              <h5 className="gradient-text">Ready to Read?📚</h5>
              <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div className="form-floating mb-3"> 
                  <input type="date" className="form-control"  id="floatingInput" placeholder="when your done?"  required onChange={(e)=>setreturningdate(e.target.value)}/>
                  <label htmlFor="floatingInput">Returning Date</label>
                </div>
                <AnimatedSignature></AnimatedSignature>

                
                <div className="d-flex justify-content-center">
                  <button className="btn btn-login text-uppercase fw-bold" type="submit">
                    Submit
                  </button>
                </div>
                <hr className="my-4" />
                <div className="w-full d-flex justify-content-center">
                 
                    <Link to="/">
                    <button className="btn btn-google text-lowercase fw-bold btn-love" type="button" >
                        <i className="fa-solid fa-book me-2" style={{whiteSpace:"nowrap",wordBreak:'keep-all'}}></i> Browse?
                        </button>
                        </Link>
                    
                 
                 
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
