import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddAsset() {
  const [asset, setAsset] = useState({
    name: '',
    description: '',
    type: '',
    serial_no: '',
    created_by: '66e6772cdd6e79520a3f110c' // Replace with dynamic value if needed
  });

  const [assetTypes, setAssetTypes] = useState([]); // State to store asset types from API
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch asset types when the component mounts
  useEffect(() => {
    const fetchAssetTypes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/assetType/get-all`);
        setAssetTypes(response.data.data); // Assuming response has a "data" field
      } catch (error) {
        console.error('Error fetching asset types', error);
      }
    };
    fetchAssetTypes();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsset({
      ...asset,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/asset/add`, asset);
      setSuccessMessage('Asset added successfully!');
      setErrorMessage('');
      setAsset({
        name: '',
        description: '',
        type: '',
        serial_no: '',
        created_by: '66e6772cdd6e79520a3f110c' // Reset the created_by field if it's static
      });
      console.log(response.data);  // Optionally log the response for debugging
    } catch (error) {
      setErrorMessage('Error adding asset. Please try again.');
      setSuccessMessage('');
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Asset</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          value={asset.name}
          onChange={handleChange}
          placeholder="Asset Name"
          required
          style={styles.input}
        />
        <input
          type="text"
          name="description"
          value={asset.description}
          onChange={handleChange}
          placeholder="Description"
          required
          style={styles.input}
        />

        {/* Dropdown for Asset Types */}
        <select
          name="type"
          value={asset.type}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Type</option>
          {assetTypes.map((type) => (
            <option key={type._id} value={type.title}>
              {type.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="serial_no"
          value={asset.serial_no}
          onChange={handleChange}
          placeholder="Serial Number"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Add Asset
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
  successMessage: {
    color: 'green',
    marginTop: '10px'
  },
  errorMessage: {
    color: 'red',
    marginTop: '10px'
  }
};

export default AddAsset;
