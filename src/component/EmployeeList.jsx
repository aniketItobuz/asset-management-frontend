import axios from 'axios';
import React, { useState, useEffect } from 'react';
import UpdateEmployeeModal from './UpdateEmployeeModal.jsx';

function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchTeams();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/employee/get-all`);
      setEmployees(response.data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:3000/employeeTeam/get-all');
      setTeams(response.data.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL}/employee/delete/${id}`);
      fetchEmployees();
    } catch (error) {
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

  return (
    <div style={styles.container}>
      {employees.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Team</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td style={styles.td}>{employee._id}</td>
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
      ) : (
        <p style={styles.noDataMessage}>Table has no data</p>
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
    width: '130%',
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
  }
};

export default EmployeeTable;
