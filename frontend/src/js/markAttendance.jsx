import '../App.css';
import {useState} from 'react';
import axios from 'axios';
function MarkAttendance() {

  const [formData, setFormData] = useState(
    {
      attendance_date: '',
      notes: '',
      selectedOption: 'present',
      employee_id: '',
    }
  );
  const options= ['present', 'absent']

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

  const handleSubmit = (event) => {
    console.log("Inside--->")
    event.preventDefault(); 
    axios.post(
      "http://localhost:8000/core/attendance-details/",{
        'attendance_date':formData.attendance_date,
        'notes': formData.notes,
        'status': formData.status,
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
          <h3>Mark Employee Attendance</h3>
        </div>
        <form className='form-group' onSubmit={handleSubmit}>
          <label>
            Date
            <input className='form-control' type='date' name='attendance_date' value={formData.attendance_date} onChange={handleChange}/>
          </label>
          <br />
          <label>
            Notes:
            <input className='form-control' type='text' name='notes' value={formData.notes} onChange={handleChange} />
          </label>
          <label>
            Status:
            <select
                value={formData.selectedOption}
                onChange={(e) => setFormData({ ...formData, selectedOption: e.target.value })}
                >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                    {option.label}
                    </option>
                ))}
                </select>
          </label>
          <br />
          <button class="btn btn-primary" type='submit' >Submit</button>
        </form>
      </div>
    </div>
  );
}

export default MarkAttendance;
