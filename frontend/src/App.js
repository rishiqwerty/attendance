import './App.css';
import {useState} from 'react';
import axios from 'axios';
function App() {

  const [formData, setFormData] = useState(
    {
      employee_name: '',
      phone_number: '',
    }
  );

  const handleChange = (e)=>{
    const { name, value } = e.target;
    console.log( value, name)
    if (name ==='phone_number' && value.length >= 10) {
      window.alert(
          "Phone Number shouldn't exceed 10 characters"
      );
    }
    else{
      setFormData((prevData) =>({
        ...prevData,
        [name]: value,
      }))
      console.log(formData)
    }
  }

  const handleSubmit = () => {
    console.log("Inside--->")
    axios.post(
      "http://localhost:8090/core/employee-details/",{
        'employee_name':formData.employee_name,
        'phone_number': formData.phone_number
      }
    ).then((res) =>{
      console.log(res)
    }).catch((error)=>{
      console.log(error)
    })
  }
  return (
    <div className='wrapper'>
      <div className='container' style={{"background": 'lightgrey'}}>
        <div>
          <h3>Sign Up</h3>
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
      </div>
    </div>
  );
}

export default App;
