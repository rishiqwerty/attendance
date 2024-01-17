import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeDetails from './js/employeeDetails';
import AttendanceDetails from './js/attendanceDetails';
import MarkAttendance from './js/markAttendance';
import NewEmployee from './js/modalEmployee';
import { Navigate } from "react-router-dom";
import Header from './js/commanComponent/header';
import { Routes, Route } from 'react-router-dom';
import SignIn from './js/signIn';

function App() {

  const [formData, setFormData] = useState(
    {
      employee_name: '',
      phone_number: '',
    }
  );
  const [isLoggedIn, setLoggedIn] = useState(true)

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone_number' && value.length >= 10) {
      window.alert(
        "Phone Number shouldn't exceed 10 characters"
      );
    }
    else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      const userResponses = await axios.get(
        `/core/userList/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      }
      );
      return true
    }
    catch (error) {
      if (error.response.status = 401) {
        return false
      }
    }
  }
  useEffect(() => {
    const fetchAuthentication = async () => {
      const authenticated = await checkAuth();
      setLoggedIn(authenticated)
    };

    fetchAuthentication();


  },[])
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(
      "core/employee-details/", {
      'employee_name': formData.employee_name,
      'phone_number': formData.phone_number
    }
    ).then((res) => {
      console.log(res)
    }).catch((error) => {
      console.error(error)
    })
  }
  if (!localStorage.getItem('token') || isLoggedIn === false) {
    return < Navigate to='/sign' replace={true} />
  }
  return (
    <div className='wrapper'>
      {/* <Header /> */}
      {/* <EmployeeDetails /> */}
      <AttendanceDetails />
      {/* <MarkAttendance /> */}
      {/* <div className='container' style={{"background": 'lightgrey'}}>
        <div>
          <h3>Create new Employee</h3>
        </div>
        <form className='form-group' onSubmit={handleSubmit}>
          <label>
            FirstName:
            <input className='form-control' type='text' name='employee_name' value={formData.employee_name} onChange={handleChange}/>
          </label>
          <br />
          <label>
            PhoneNumber:
            <input className='form-control' type='number' name='phone_number' value={formData.phone_number} onChange={handleChange} maxLength={10}/>
          </label>
          <br />
          <button class="btn btn-primary" type='submit' >Submit</button>
        </form>
      </div> */}
    </div>
  );
}

export default App;
