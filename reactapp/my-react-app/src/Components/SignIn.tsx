import axios from "axios";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import generateCalendar from "antd/es/calendar/generateCalendar";

export default function SignIn({ show, onClose }: { show: boolean; onClose: () => void }) {
    const[FirstName,setFirstName]=useState<string>('');
    const[LastName,setLastName]=useState<string>('');
    const[BirthDate,setBirthDate]=useState("");
    const[Gender,setGender]=useState<string>('');
    const[username,setUsername]=useState<string>('');
    const[password,setPassword]=useState<string>('');
    const {login}=useAuth();
    const handleDateChange = (e: { target: { value: string | number | Date; }; }) => {
        const selectedDate = new Date(e.target.value); // Convert input to Date object
        const formattedDate = selectedDate.toISOString().split("T")[0]; // Convert to "YYYY-MM-DD"
        setBirthDate(formattedDate);
      };
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (!username || !password || !FirstName || !LastName || !BirthDate) {
            alert('Please fill all required fields');
            return;
        }

        if (password.length < 8 || password.length > 12) {
            alert('Password must be 8-12 characters');
            return;
        }

        const apiUrl = 'http://localhost:5000/api/user/SignUp';
        const requestData = {
            username,
            password,
            FirstName,
            LastName,
            DateOfBirth: BirthDate, // Match your backend expectation
            Gender
        };

        try {
            const response = await axios.post(apiUrl, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            
            if (response.data.message) {
                alert(response.data.message);
                login(username,response.data.tokon);
            }

            if (response.data.tokon) {
                localStorage.setItem('token', response.data.tokon);
                localStorage.setItem('username', username);
                login(username, response.data.tokon);
                onClose(); // Close the form after successful signup
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
                    alert(error.response?.statusText || 'Signup failed');
                }
            } else {
                alert('An unexpected error occurred');
            }
        }
    };

  
    return(
        <div className={`LoginForm ${show ? "show" : ""}`}>
        <div className="row w-full" style={{width:'60%',justifySelf:"center"}}>
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto" >
            <div className="card border-0 shadow rounded-3 my-5" style={{background:''}}>
              <div className="close-btn" onClick={onClose}>✖</div>
              <div className="card-body d-flex flex-column">
             
                <h5 className="gradient-text">Sign Up <i className="fi fi-ts-quill-pen-story"></i></h5>
                <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
                  <div className="form-floating mb-3"> 
                    <input type="text" className="form-control"  id="floatingInput" placeholder="name@example.com" value={FirstName} required onChange={(e)=>setFirstName(e.target.value)}  />
                    <label htmlFor="floatingInput" style={{color:'black'}}>FirstName</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingPassword" placeholder="Password" value={LastName} required onChange={(e)=>setLastName(e.target.value)}/>
                    <label htmlFor="floatingPassword" style={{color:'black'}}>LastName</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="date" className="form-control" id="floatingPassword" placeholder="Password" value={BirthDate} required onChange={handleDateChange}/>
                    <label htmlFor="floatingPassword" style={{color:'black'}}>BirthDate</label>
                  </div>
                  
                  <div className="form-floating mb-3">
                 
                    <select value={Gender} onChange={(e)=>setGender(e.target.value)} style={{color:'black'}}>
                        <option value="Gender">Gender</option>
                        <option value="Female" >Female</option>
                        <option value="Male">Male</option>
                    </select>
                   
                  </div>
                  <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingPassword" placeholder="usernmae" value={username} required onChange={(e)=>setUsername(e.target.value)}/>
                    <label htmlFor="floatingPassword"  style={{color:'black'}} >username</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingPassword" placeholder="Password" value={password} required onChange={(e)=>setPassword(e.target.value)} minLength={8} maxLength={12} />
                    <label htmlFor="floatingPassword"  style={{color:'black'}}>Password</label>
                  </div>

  
                 
                  <div className="d-flex justify-content-center">
                    <button className="btn btn-login text-uppercase fw-bold" type="submit">
                      Sign Up
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
