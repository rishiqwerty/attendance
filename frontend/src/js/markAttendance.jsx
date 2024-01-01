import '../App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
function MarkAttendance() {
  const { id } = useParams(); // Access "id" from the URL
  const { state } = useLocation(); // Access passed state
  const [formData, setFormData] = useState(
    {
      attendance_date: state.attendance_date,
      notes: state.notes,
      status: state.status,
      employee_id: id,
    }
  );
  const options = [{ 'label': 'Present', 'value': 'Present'},
    {'label': 'Absent', 'value': 'Absent'}
]

  const handleChange = async (e)=>{
    const { name, value } = e.target;
    console.log( value, name)
    if (name ==='attendance_date') {
      try {
        const response = await axios.get(
          `core/attendance-details/?attendance_date=${value}`
        );
        if (!response.data.results =='[]'){
          setFormData(response.data.results[0]);
        }
      } catch (error) {
        console.error(error);
      }
    }
    else{
      setFormData((prevData) =>({
        ...prevData,
        [name]: value,
      }))
      console.log(formData)
    }
  }
  useEffect(() => {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `core/attendance-details/?attendance_date=${currentDate}`
        );
        if (!response.data.results =='[]'){
          setFormData(response.data.results[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  
    
  const handleSubmit = (event) => {
    console.log("Inside--->", formData)
    event.preventDefault(); 
    axios.post(
      "core/attendance-details/",{
        'attendance_date':formData.attendance_date,
        'notes': formData.notes,
        'status': formData.status,
        'employee_id': formData.employee_id
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
                className='form-select'
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                    {option.label}
                    </option>
                ))}
                </select>
          </label>
          <br />
          <button className="btn btn-primary" type='submit' >Submit</button>
        </form>
      </div>
    </div>
  );
}

export default MarkAttendance;
