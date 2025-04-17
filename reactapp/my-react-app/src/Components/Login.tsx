import axios from "axios";
import React, { useState } from "react";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
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
          'Content-Type': 'application/json' 
        },
        // withCredentials: true // Uncomment if using cookies
      });

      // Axios wraps the response in a 'data' property
      alert(`Welcome ${response.request.message}`);
      if (response.data.message) {
        alert(response.data.message);
        localStorage.setItem('username',username);
        
    }
      // Store token if your API returns one
      if (response.data.token) {
        localStorage.setItem('username',username);
        localStorage.setItem('token', response.data.token);
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
        alert('An unexpected error occurred');
      }
    }
  };

  return (
    <>
      <div>Login Form</div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password"  // Changed to password type for security
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;