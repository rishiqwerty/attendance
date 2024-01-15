import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ReactPaginate from 'react-paginate';
import { useParams, useNavigate } from 'react-router-dom';
import ModalContent from './filterModal';

function AttendanceDetails() {
  const [data, setData] = useState([]);
  const [pay, setPayData] = useState({ days_worked: 0, Total_payment: 0, absent_days: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState('All');
  const [listOfUsers, setUsersList] = useState([]);
  const a = new Date();
  const [dateFilter, setDate] = useState(
    {
      start:a.getFullYear()+'-'+a.getMonth()+1+'-'+'01',
      end:a.getFullYear()+'-'+a.getMonth()+1+'-'+a.getDate(),
    }
  );

  const navigate = useNavigate();
  const { id } = useParams(); // Access "id" from the URL

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.get(
        `/core/attendance-details/?${id ? 'employee_id=' + id + '&' : ''}${dateFilter.start && dateFilter.end ? 'attendance_start_date=' + dateFilter.start + '&attendance_end_date=' + dateFilter.end+'&' : ''}page=${page}`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      }
      );
      if (response) {
        setData(response.data.results);
      }
      setPageCount(Math.ceil(response.data.count / 10)); // Assuming your API provides total count
      if (id !== undefined) {
        const pay_response = await axios.get(
          `/core/pay-details/?employee_id=${id}&attendance_start_date=${dateFilter.start}&attendance_end_date=${dateFilter.end}`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
        );
        if (pay_response.data) {
          setPayData(pay_response.data);
        }
      }

      if (id === undefined) {
        const userResponses = await axios.get(
          `/core/userList/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
        );
        if (userResponses) {
          setUsersList(userResponses.data)
        }
      }

    } catch (error) {
      console.log(">>>>>>", pay)
      console.error(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageClick = (data) => {
    console.log(data)
    const actualPage = Math.min(data.selected + 1, pageCount);
    setCurrentPage(actualPage); // Adjust for zero-based indexing
  };

  const handleClick = (data) => {
    navigate(`/person-details/${data.employee_id}`, { state: data });
  }
  const handleUserChange = (event) => {
    console.log("this is data", event.target.value)
    navigate(`/attendance-details/${event.target.value}`, { state: event.target.value });
  }
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDate(prevState => ({ ...dateFilter, [name]: value }))
    console.log('Tgis--', dateFilter)
    if (dateFilter.start && dateFilter.end){
      setCurrentPage(1)
      fetchData(currentPage)
    }
  }

  return (
    <div className="container">
      {!id ?
        <div>
          <label htmlFor="mySelect">Filter By Employee:</label>
          <select id="mySelect" value={currentUser} onChange={handleUserChange}>
            <option value="all">All</option>
            {listOfUsers.map((user) => (
              <option key={user.id} value={user.id}>{user.employee_name}</option>
            ))}
          </select>
        </div>

        : <></>}
      <div>
        Start Date: <input type='date' value={dateFilter.start} name='start' onChange={handleDateChange} />
        End Date: <input type='date' value={dateFilter.end} name='end' onChange={handleDateChange} />

      </div>
      {(pay.absent_days !== 0 && pay.days_worked !== 0) ? <p>Payment Due: ₹ {pay.Total_payment}</p> : <></>}
      {isLoading && <p className="text-center">Loading data...</p>}
      {/* {error && <p className="text-danger">{error.message}</p>} */}

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee Name</th>
            <th>Status</th>
            <th>Notes</th>

          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.attendance_date}</td>
              <td>{item.employee_name}</td>
              <td>{item.status}</td>
              <td>{item.notes}</td>
              <td><button className='btn btn-dark' onClick={() => handleClick(item)}>Mark Attendance</button></td>

            </tr>
          ))}
        </tbody>


      </table>

      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />


    </div>
  );
}
export default AttendanceDetails;
