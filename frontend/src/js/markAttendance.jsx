import '../App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import Header from './commanComponent/header';
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
  const [attendance_marked, setAttendanceMarked] = useState(
    {
      attendance_marked: false,
    }
  )
  const options = [{ 'label': 'Present', 'value': 'Present'},
    {'label': 'Absent', 'value': 'Absent'}
]

  const handleChange = async (e)=>{
    const { name, value } = e.target;
    console.log( value, name)
    if (name ==='attendance_date') {
      try {
      const token = window.localStorage.getItem("token");
      const response = await axios.get(
          `/core/attendance-details/?employee_id=${formData.employee_id}&attendance_date=${value}`,{
            headers: {
              'Authorization': `Token ${token}`
            }
          }
        );
        if (!(response.data.results.length===0)){
          console.log('WTF!!', response.data.results[0])
          setFormData(response.data.results[0]);
          setAttendanceMarked({'attendance_marked':true})
        }
        else{
          console.log('Hmmmm!!', response.data.results.length)
          setFormData({
            attendance_date: value,
            notes: '',
            status: 'Absent',
            employee_id: id,
          });
          setAttendanceMarked({'attendance_marked':false})
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
    const currentDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
    const fetchData = async () => {
      
      try {
        const token = window.localStorage.getItem("token");
        const response = await axios.get(
          `/core/attendance-details/?employee_id=${formData.employee_id}&attendance_date=${currentDate}`,{
            headers: {
              'Authorization': `Token ${token}`
            }
          }
        );
        if (!(response.data.results.length === 0)){
          setFormData(response.data.results[0]);
          setAttendanceMarked({'attendance_marked':true})
        }
        else{
          console.log("Inside askkfs", attendance_marked.attendance_marked)
          setFormData({
            attendance_date: currentDate,
            notes: '',
            status: 'Absent',
            employee_id: id,
          });
          setAttendanceMarked({'attendance_marked':false})
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  
    
  const handleSubmit = (event) => {
    console.log("Inside--->", formData)
    const token = window.localStorage.getItem("token");

    event.preventDefault(); 
    axios.post(
      "/core/attendance-details/",{
        'attendance_date':formData.attendance_date,
        'notes': formData.notes,
        'status': formData.status,
        'employee_id': formData.employee_id
      },{
        headers: {
          'Authorization': `Token ${token}`
        },
      }
    ).then((res) =>{
      console.log(res)
      setAttendanceMarked({'attendance_marked':true})
    }).catch((error)=>{
      console.log(error)
    })
  }
  return (
    <div className='wrapper'>
      <Header />
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
          <div>
            {!attendance_marked.attendance_marked && <p>*New Attendace</p>}
          </div>
          <button className="btn btn-primary" type='submit' >Submit</button>
        </form>
      </div>
    </div>
  );
}

export default MarkAttendance;
