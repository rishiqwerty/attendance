import React, { useState } from 'react';
import { Navigate } from "react-router-dom";

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to your authentication API endpoint
      const response = await fetch('http://localhost:8000/auth/token/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      // Handle successful login (e.g., store token in local storage)
      console.log('resofdsgf', response)
      console.log('resofdsgf', data)
      localStorage.setItem('token', data.auth_token);

      // Redirect to protected area or display success message
      console.log('Login successful!');
    } catch (error) {
      setError('Invalid username or password');
    }
  };
  if (localStorage.getItem('token')){
    return < Navigate to='/' replace={true} />
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      {error && <div className="error">{error}</div>}
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
}

export default SignIn;
