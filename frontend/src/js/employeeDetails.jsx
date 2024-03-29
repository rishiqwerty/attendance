import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, useNavigate } from 'react-router-dom';
import Header from './commanComponent/header';

function EmployeeDetails() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // const { id } = useParams();
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.get(
        `/core/employee-details/?page=${page}`,{
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      );
      setData(response.data.results);
      setPageCount(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  const handleClick = () => {
    navigate(`/new-employee/`);
  }

  const newAttendanceClick = (data) => {
    navigate(`/person-details/${data.id}`, { state: data });
  }
  return (
    <div className="container">
      <Header />
      <h2>Employee Details</h2>
      <button className='btn btn-dark' onClick={() => handleClick()}>New Employee</button>
      {isLoading && <p className="text-center">Loading data...</p>}
      {error && <p className="text-danger">{error.message}</p>}

      <div className="row">
        <div className="col-md-12">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Joining Date</th>
                <th>Phone Number</th>
                <th>Per Day Pay</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.employee_name}</td>
                  <td>{item.joined_date}</td>
                  <td>{item.phone_number}</td>
                  <td>{item.employee_pay?'₹'+item.employee_pay.employee_pay_per_day:'N/A'}</td>
                  <td><button className='btn btn-dark' onClick={()=>navigate(`/new-employee/${item.id}`, {state:item})}>Edit</button></td>
                  <td><button className='btn btn-dark' onClick={() => newAttendanceClick(item)}>Mark Attendance</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <nav aria-label="Page navigation">
        <ul className="pagination">
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
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            renderItem={({ page, type, selected }) => {
              return (
                <li key={page} className={`page-item ${selected ? 'active' : ''}`}>
                  <a className="page-link" href="#">{page}</a>
                </li>
              );
            }}
          />
        </ul>
      </nav>
    </div>
  );
}

export default EmployeeDetails;
