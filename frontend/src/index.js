import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';  
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MarkAttendance from './js/markAttendance';
import SignIn from './js/signIn';
import EmployeeDetails from './js/employeeDetails';
import NewEmployee from './js/modalEmployee';
import AttendanceDetails from './js/attendanceDetails';
import Header from './js/commanComponent/header';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
      <Route path="/sign" element={<SignIn />} />
      <Route path="/" element={<App />} />
        <Route path="/person-details/:id" element={<MarkAttendance />} />
        <Route path="/employee-details/" element={<EmployeeDetails />} />
        <Route path="/new-employee/" element={<NewEmployee />} />
        <Route path="/new-employee/:id" element={<NewEmployee />} />
        <Route path="/attendance-details/:id" element={<AttendanceDetails />} />

      </Routes>
    </BrowserRouter>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
