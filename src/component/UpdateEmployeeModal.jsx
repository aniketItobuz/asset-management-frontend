import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateEmployeeModal({ employeeId, onClose, onUpdate }) {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    phone_no: '',
    team: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (employeeId) {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_URL}/employee/get/${employeeId}`)
        .then(response => {
          setEmployee(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching employee:', error);
          setError('Failed to fetch employee data.');
          setLoading(false);
        });
    }
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prevEmployee => ({
      ...prevEmployee,
      [name]: name === 'phone_no' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_URL}/employee/update/${employeeId}`, employee);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating employee:', error);
      setError('Failed to update employee.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2>Update Employee</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={handleChange}
            placeholder="Name"
            required
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            placeholder="Email"
            required
            style={styles.input}
          />
          <input
            type="text"
            name="phone_no"
            value={employee.phone_no}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            style={styles.input}
          />
          <input
            type="text"
            name="team"
            value={employee.team}
            onChange={handleChange}
            placeholder="Team"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>Update</button>
          <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default UpdateEmployeeModal;
