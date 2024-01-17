import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Header() {
  const navigate = useNavigate();

  const handleLogoutButton = () => {
    const csrfToken = Cookies.get('csrftoken');
    const token = window.localStorage.getItem('token');

    fetch(`/auth/token/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
        'Authorization': `Token ${token}`,
      },
      credentials: 'include'
    })
      .then(res => res.status)
      .then(response => {
        console.log('Logged Out', response)
        window.localStorage.removeItem("token");
        navigate('/sign')
      })
      .catch(error => console.error(error));
  };

  return (
    <header className="main-header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand">
            <b>Attendance</b>
          </Link>
          <ul className="navbar-nav flex-row-reverse ">
            <li className="nav-item px-2">
              <button
                className="btn btn-danger"
                title="Sign Out"
                onClick={handleLogoutButton}
              >Logout</button>
            </li> 
            <li className="nav-item d-flex align-items-center">
                <Link className="link-dark text-decoration-none justify-content-center" to="/employee-details">
                    <b>Employees</b>
                </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
