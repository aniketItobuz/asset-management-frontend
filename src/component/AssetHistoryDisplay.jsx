import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AssetHistory() {
  const [assets, setAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  // Fetch all assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/asset/get-all`);
        setAssets(response.data.data);
      } catch (error) {
        setError('Error fetching asset list. Please try again.');
        console.error(error);
      }
    };

    fetchAssets();
  }, []);

  // Handle dropdown change
  const handleAssetChange = (e) => {
    setSelectedAssetId(e.target.value);
  };

  // Fetch asset history
  const fetchHistory = async () => {
    if (!selectedAssetId) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/asset/assetHistory/${selectedAssetId}`);
      setHistory(response.data.data);
      setError('');
    } catch (error) {
      setError('Error fetching asset history. Please try again.');
      console.error(error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔍 Asset Assignment History</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="asset_id" style={styles.label}>Select Asset:</label>
        <select
          name="asset_id"
          value={selectedAssetId}
          onChange={handleAssetChange}
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
        <button type="submit" style={styles.submitButton}>Search</button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {history.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Asset ID</th>
              <th style={styles.th}>Previous Assignee</th>
              <th style={styles.th}>Current Assignee</th>
              <th style={styles.th}>Assigned Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry._id}>
                <td style={styles.td}>{entry.asset_id}</td>
                <td style={styles.td}>
                  {entry.previous_assignee ? entry.previous_assignee.name : 'None'}
                </td>
                <td style={styles.td}>
                  {entry.current_assignee ? entry.current_assignee.name : 'None'}
                </td>
                <td style={styles.td}>{new Date(entry.assigned_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px auto',
    maxWidth: '900px',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#2980b9',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '20px',
  },
  select: {
    marginRight: '10px',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    width: '300px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    margin: '10px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  th: {
    backgroundColor: '#007bff',
    color: '#fff',
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
  label: {
    marginRight: '10px',
    fontSize: '16px',
    color: '#333',
  }
};

export default AssetHistory;
