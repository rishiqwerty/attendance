import './App.css';
import {useState} from 'react';
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

  return (
    <form onSubmit={handleChange}>
      <label>
        FirstName:
        <input type='text' name='employee_name' value={formData.employee_name} onChange={handleChange}/>
      </label>
      <br />
      <label>
        PhoneNumber:
        <input type='number' name='phone_number' value={formData.phone_number} onChange={handleChange} maxLength={10}/>
      </label>
      <br />
      <button type='submit' >Submit</button>
    </form>
  );
}

export default App;
