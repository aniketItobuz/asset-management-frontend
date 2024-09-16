import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateAssetModal({ assetId, onClose, onUpdate }) {
  const [asset, setAsset] = useState({
    name: '',
    description: '',
    type: '',
    serial_no: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (assetId) {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_URL}/asset/get/${assetId}`)
        .then(response => {
          setAsset(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching asset:', error);
          setError('Failed to fetch asset data.');
          setLoading(false);
        });
    }
  }, [assetId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsset(prevAsset => ({
      ...prevAsset,
      [name]: name === 'serial_no' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_URL}/asset/update/${assetId}`, asset);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating asset:', error);
      setError('Failed to update asset.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2>Update Asset</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            value={asset.name}
            onChange={handleChange}
            placeholder="Name"
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
          <input
            type="text"
            name="type"
            value={asset.type}
            onChange={handleChange}
            placeholder="Type"
            required
            style={styles.input}
          />
          <input
            type="text"
            name="serial_no"
            value={asset.serial_no}
            onChange={handleChange}
            placeholder="Serial Number"
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

export default UpdateAssetModal;
