import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateEmployeeModal from './UpdateEmployeeModal.jsx'; // Import the UpdateEmployeeModal component

function EmployeeTable({ token }) {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // States for pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Items per page
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchEmployees();
      fetchTeams();
    }
  }, [token, page, limit]); // Re-fetch employees when page, limit, or token changes

  const fetchEmployees = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/employee/get-all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: limit,
        },
      });
      setEmployees(response.data.data);
      setTotalPages(response.data.meta.totalPages); // Set total pages from response
    } catch (error) {
      setError('Error fetching employees. Please try again later.');
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:3000/employeeTeam/get-all');
      setTeams(response.data.data);
    } catch (error) {
      setError('Error fetching teams. Please try again later.');
      console.error('Error fetching teams:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL}/employee/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEmployees();
    } catch (error) {
      setError('Error deleting employee. Please try again later.');
      console.error('Error deleting employee:', error);
    }
  };

  const handleUpdate = (id) => {
    setSelectedEmployeeId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployeeId(null);
  };

  const updateEmployeeList = () => {
    fetchEmployees();
  };

  const getTeamTitle = (teamId) => {
    const team = teams.find(t => t._id === teamId);
    return team ? team.title : 'Unknown';
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div style={styles.container}>
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && employees.length > 0 ? (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone No</th>
                <th style={styles.th}>Team</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td style={styles.td}>{employee.name}</td>
                  <td style={styles.td}>{employee.email}</td>
                  <td style={styles.td}>{employee.phone_no}</td>
                  <td style={styles.td}>{getTeamTitle(employee.team)}</td>
                  <td style={styles.td}>{employee.status ? 'Active' : 'Inactive'}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleUpdate(employee._id)} 
                      style={{ ...styles.actionButton, ...styles.updateButton }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                    >
                      Update
                    </button>
                    <button 
                      onClick={() => handleDelete(employee._id)} 
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div style={styles.pagination}>
            <button 
              onClick={handlePreviousPage} 
              disabled={page === 1} 
              style={styles.pageButton}
            >
              Previous
            </button>
            <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
            <button 
              onClick={handleNextPage} 
              disabled={page === totalPages} 
              style={styles.pageButton}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        !loading && <p style={styles.noDataMessage}>No employees found.</p>
      )}
      {showModal && (
        <UpdateEmployeeModal
          employeeId={selectedEmployeeId}
          onClose={closeModal}
          onUpdate={updateEmployeeList}
        />
      )}
    </div>
  );
}

// Define the styles after the component function
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px auto',
    maxWidth: '800px',
  },
  table: {
    width: '140%',
    borderCollapse: 'collapse',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  th: {
    backgroundColor: '#f4f4f4',
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    fontSize: '16px',
  },
  td: {
    border: '1px solid #ddd',
    padding: '12px',
    fontSize: '14px',
  },
  actionButton: {
    margin: '0 5px',
    padding: '6px 12px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  },
  updateButton: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
  },
  noDataMessage: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#888',
    margin: '20px 0',
  },
  pagination: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageButton: {
    padding: '6px 12px',
    margin: '0 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  pageInfo: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default EmployeeTable;
