import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AssetAssign() {
  const [formData, setFormData] = useState({
    asset_id: '',
    new_assignee_id: ''
  });
  const [returnData, setReturnData] = useState({
    asset_id: ''
  });
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingReturn, setLoadingReturn] = useState(false);

  useEffect(() => {
    const fetchAssetsAndEmployees = async () => {
      try {
        const [assetsResponse, employeesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_URL}/asset/get-all`),
          axios.get(`${import.meta.env.VITE_URL}/employee/get-all`)
        ]);

        setAssets(assetsResponse.data.data);
        setEmployees(employeesResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAssetsAndEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleReturnChange = (e) => {
    const { name, value } = e.target;
    setReturnData({
      ...returnData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/asset/assetAssign`, formData);
      setMessage(response.data.message);
      setMessageType('success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error assigning asset. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setLoadingReturn(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/asset/assetReturn`, returnData);
      setMessage(response.data.message);
      setMessageType('success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error returning asset. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
      console.error(error);
    } finally {
      setLoadingReturn(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* Asset Assignment Form */}
      <div style={styles.formContainer}>
        <h3 style={styles.formTitle}>Assign Asset</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="asset_id" style={styles.label}>Select Asset:</label>
          <select
            name="asset_id"
            value={formData.asset_id}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="" disabled>Select an asset</option>
            {assets.map((asset) => (
              <option key={asset._id} value={asset._id}>
                {asset.name} (Serial No: {asset.serial_no})
              </option>
            ))}
          </select>

          <label htmlFor="new_assignee_id" style={styles.label}>Select Assignee:</label>
          <select
            name="new_assignee_id"
            value={formData.new_assignee_id}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="" disabled>Select an assignee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name} (Email: {employee.email})
              </option>
            ))}
          </select>

          <button
            type="submit"
            style={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Assigning...' : 'Assign Asset'}
          </button>
        </form>
      </div>

      {/* Asset Return Form */}
      <div style={styles.formContainer}>
        <h3 style={styles.formTitle}>Return Asset</h3>
        <form onSubmit={handleReturnSubmit} style={styles.form}>
          <label htmlFor="asset_id" style={styles.label}>Select Asset to Return:</label>
          <select
            name="asset_id"
            value={returnData.asset_id}
            onChange={handleReturnChange}
            required
            style={styles.select}
          >
            <option value="" disabled>Select an asset</option>
            {assets.map((asset) => (
              <option key={asset._id} value={asset._id}>
                {asset.name} (Serial No: {asset.serial_no})
              </option>
            ))}
          </select>

          <button
            type="submit"
            style={styles.submitButton}
            disabled={loadingReturn}
          >
            {loadingReturn ? 'Returning...' : 'Return Asset'}
          </button>
        </form>
      </div>

      {/* Display message */}
      {message && (
        <p style={{ ...styles.message, color: messageType === 'success' ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}

// Styles remain unchanged
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    maxWidth: '600px',
    margin: '0 auto',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#2980b9'
  },
  formContainer: {
    width: '100%',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  formTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#2980b9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  select: {
    marginBottom: '15px',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box'
  },
  submitButton: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
  },
  message: {
    marginTop: '10px',
    fontSize: '16px',
  },
  label: {
    marginBottom: '5px',
    fontSize: '16px',
    color: '#333'
  }
};

export default AssetAssign;
