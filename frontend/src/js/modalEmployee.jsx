import '../App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import Header from './commanComponent/header';
function NewEmployee() {
  const { id } = useParams(); // Access "id" from the URL
  const { state } = useLocation(); // Access passed state
  const [formData, setFormData] = useState(
    {
      employee_name: state?state.employee_name:'',
      employee_pay: state?state.employee_pay:'',
      phone_number: state?state.phone_number:'',
    }
  );

  const handleChange = async (e)=>{
    const { name, value } = e.target;
    console.log( value, name)
    
      setFormData((prevData) =>({
        ...prevData,
        [name]: value,
      }))
      console.log(formData)
  }


  const handleSubmit = (event) => {
    const token = window.localStorage.getItem("token");

    event.preventDefault(); 
    console.log("is:",id)
    if (id===undefined){
    axios.post(
      `/core/employee-details/${id?id+'/':''}`,{
        'employee_name':formData.employee_name,
        'employee_pay': formData.employee_pay,
        'phone_number': formData.phone_number
      },{
        headers: {
          'Authorization': `Token ${token}`
        },
      }
    ).then((res) =>{
      console.log(res)
    }).catch((error)=>{
      console.log(error)
    })}
    else{
        axios.put(
            `/core/employee-details/${id?id+'/':''}`,{
              'employee_name':formData.employee_name,
              'employee_pay': formData.employee_pay,
              'phone_number': formData.phone_number
            },{
              headers: {
                'Authorization': `Token ${token}`
              },
            }
          ).then((res) =>{
            console.log(res)
          }).catch((error)=>{
            console.log(error)
          })
    }
  }
  return (
    <div className='wrapper'>
    <Header />
      <div className='container' style={{"background": 'lightgrey'}}>
        <div>
          <h3>Add New Employee</h3>
        </div>
        <form className='form-group' onSubmit={handleSubmit}>
          <label>
            Employee Name:
            <input className='form-control' type='text' name='employee_name' value={formData.employee_name} onChange={handleChange} />
          </label>
          <label>
            Phone Number:
            <input className='form-control' type='phone_number' name='phone_number' value={formData.phone_number} onChange={handleChange} />
          </label>
          <label>
            Pay:
            <input className='form-control' type='number' name='employee_pay' value={formData.employee_pay} onChange={handleChange} />
          </label>
          <br />
          <button className="btn btn-primary" type='submit' >Submit</button>
        </form>
      </div>
    </div>
  );
}

export default NewEmployee;
