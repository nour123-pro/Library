import { Link } from "react-router-dom";
import AnimatedSignature from "./AnimatedSignature";
import React from "react";
import axios from "axios";

export default function ConfirmDeleteComment({show, onClose,commentid}:{commentid:string,show: boolean; onClose: () => void}) {

    const handleSubmit=async (e:React.FormEvent)=>{
        e.preventDefault();
        const apirul="http://localhost:5000/api/Comment/deleteComment";
        const requestbody={
             commentid
        }
        try {
            const response=await axios.post(apirul,requestbody,{
                headers: { 
                    'Content-Type': 'application/json' ,
                    'Accept': 'application/json'
                  },
            });
            if(response.data.message){
                 alert(response.data.message);
                 onClose();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Proper error handling for Axios
                const serverResponse = error.response?.data;
                        if (serverResponse?.errors) {
                            alert(serverResponse.errors.join('\n'));
                        } 
                        else if (serverResponse?.message) {
                            alert(serverResponse.message);
                        }
                        else {
                            alert(error.response?.statusText || 'Deleting Comment failed,try again');
                        }
              } else {
                alert(error);
              }
        }
    }
    return(
        <div className={`LoginForm ${show ? "show" : ""}`}>
      
        <div className="row w-full">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card border-0 shadow rounded-3 my-5" style={{background:'none'}}>
              <div className="close-btn" onClick={onClose}>✖</div>
              <div className="card-body d-flex flex-column">
                <h5 className="gradient-text">Read</h5>
                <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                 
  
                  <p> Are you sure you want to delete your comment?</p>
                  <div className="deleteformbuttons" >
                    <button className="btn btn-login text-uppercase fw-bold" onClick={onClose} type="reset">Cancel</button>
                    <button className="btn btn-login text-uppercase fw-bold" type="submit">
                    Yes
                    </button>
                  </div>
                  <hr className="my-4" />
               
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}