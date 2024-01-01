import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrfToken = Cookies.get('csrftoken');

    try {
      // Send POST request to your authentication API endpoint
      const response = await fetch('auth/token/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "X-CSRFToken": csrfToken, },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      // Handle successful login (e.g., store token in local storage)
      localStorage.setItem('token', data.auth_token);

      // Redirect to protected area or display success message
      console.log('Login successful!',localStorage.getItem('token')?true:false);
      history('/')
    } catch (error) {
      setError('Invalid username or password');
    }
  };
  if (localStorage.getItem('token')){
    history('/')
    
    // console.log("Inside!!")
    // return < Navigate to='/' replace={true} />
  }
  return (
    <form onSubmit={handleSubmit} className="container">
      <h2 className="text-center">Sign In</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-group">
        <label htmlFor="username" className="col-form-label">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="col-form-label">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
        />
      </div>
      {/* <button type="submit" className="btn btn-primary nx">Sign In</button> */}
        <button type="submit" className="btn btn-primary w-100 mt-4">Sign In</button>

    </form>

  );
}

export default SignIn;
