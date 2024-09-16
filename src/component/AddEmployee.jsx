import React, { useState } from 'react';
import axios from 'axios';

function AddEmployee() {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    phone_no: '',
    team: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert phone_no to number if it's a phone number field
    if (name === 'phone_no') {
      setEmployee({
        ...employee,
        [name]: value ? Number(value) : '' // Convert to number
      });
    } else {
      setEmployee({
        ...employee,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/employee/add`, employee);
      setSuccessMessage('Employee added successfully!');
      setErrorMessage('');
      setEmployee({
        name: '',
        email: '',
        phone_no: '',
        team: ''
      });
      console.log(response.data);  // Optionally log the response for debugging
    } catch (error) {
      setErrorMessage('Error adding employee. Please try again.');
      setSuccessMessage('');
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Employee</h2>
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
        <button type="submit" style={styles.button}>
          Add Employee
        </button>
      </form>

      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
}

// Modern design styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px auto',
    maxWidth: '800px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff'
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  input: {
    margin: '10px 0',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
    fontSize: '16px'
  },
  button: {
    padding: '12px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  successMessage: {
    color: 'green',
    marginTop: '10px'
  },
  errorMessage: {
    color: 'red',
    marginTop: '10px'
  }
};

export default AddEmployee;
