import axios from "axios";
import { useState } from "react";
import{useNavigate} from "react-router-dom";
import { useAuth } from "./AuthContext";
export default function LoginForm({ show, onClose ,onSignUpClick}: { show: boolean; onClose: () => void, onSignUpClick:()=>void }) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const[user,setUser]=useState<string>('');

  const {login}=useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const apiUrl = 'http://localhost:5000/api/user/login';
    const requestData = {
      username,
      password
    };

    try {
      // Correct axios syntax
      const response = await axios.post(apiUrl, requestData, {
        headers: { 
          'Content-Type': 'application/json' ,
          'Accept': 'application/json'
        },
        // withCredentials: true // Uncomment if using cookies
      });

      // Axios wraps the response in a 'data' property
      if (response.data.message) {
        alert(response.data.message);
        login(username,response.data.tokon);
    }

      
      
      
      // Store token if your API returns one
      if (response.data.tokon) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username',username);
        console.log("i am gere"+localStorage.getItem("username"));
        login(username,response.data.tokon);
        onClose(); // Close the form after successful signup
       
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
                    alert(error.response?.statusText || 'Login failed');
                }
      } else {
        alert(error);
      }
    }
  };
 

  return (
    <div className={`LoginForm ${show ? "show" : ""}`} >
      <div className="row w-full" >
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto" >
          <div className="card border-0 shadow rounded-3 my-5"  style={{backgroundColor:'white'}}>
            <div className="close-btn" onClick={onClose}>✖</div>
            <div className="card-body d-flex flex-column">
              <h5 className="gradient-text">Login <i className="fi fi-ts-quill-pen-story"></i></h5>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3"> 
                  <input type="text" className="form-control"  id="floatingInput" placeholder="name@example.com" value={username} required onChange={(e)=>setUsername(e.target.value)}/>
                  <label htmlFor="floatingInput" style={{color:'black'}}>Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={password} required onChange={(e)=>setPassword(e.target.value)}/>
                  <label htmlFor="floatingPassword" style={{color:'black'}}>Password</label>
                </div>

                
                <div className="d-flex justify-content-center">
                  <button className="btn btn-login text-uppercase fw-bold" type="submit">
                    Sign in
                  </button>
                </div>
                <hr className="my-4" />
                <div className="w-full d-flex justify-content-center">
                  <button className="btn btn-google text-uppercase fw-bold" type="button" onClick={() => { onSignUpClick(); onClose(); }}>
                     New? <i className="fi fi-ts-insert-alt"></i>
                  </button>
                 
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
