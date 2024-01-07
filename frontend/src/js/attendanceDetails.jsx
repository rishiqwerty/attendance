import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useParams,useNavigate } from 'react-router-dom';

function AttendanceDetails() {
  const [data, setData] = useState([]);
  const [pay, setPayData] = useState({ days_worked: 0, Total_payment: 0, absent_days: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
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
        `/core/attendance-details/?${id?'employee_id='+id+'&':''}page=${page}`,{
        headers: {
          'Authorization': `Token ${token}`
        }
      }
      );
      if (response){
        setData(response.data.results);
      }
      const pay_response = await axios.get(
        `/core/pay-details/?employee_id=${id}&attendance_start_date=2024-01-01&attendance_end_date=2024-01-07`,{
        headers: {
          'Authorization': `Token ${token}`
        }
      }
      );
      if (pay_response.data){
        setPayData(pay_response.data);

      }
      
      setPageCount(Math.ceil(response.data.count / 10)); // Assuming your API provides total count
    } catch (error) {
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

  return (
    <div className="container">
      <h2>Attendance List</h2>
      <p>Payment Due: ₹ {pay.Total_payment}</p>
      {isLoading && <p className="text-center">Loading data...</p>}
      {error && <p className="text-danger">{error.message}</p>}

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
