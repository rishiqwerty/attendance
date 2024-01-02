import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';


function AttendanceDetails() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.get(
        `/core/attendance-details/?page=${page}`,{
        headers: {
          'Authorization': `Token ${token}`
        }
      }
      );
      setData(response.data.results);
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
