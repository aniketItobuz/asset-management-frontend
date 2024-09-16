import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateAssetModal from './UpdateAssetModal'; // Import the UpdateAssetModal component

function AssetList() {
  const [assets, setAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/asset/get-all`);
      setAssets(response.data.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL}/asset/delete/${id}`);
      fetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleUpdate = (id) => {
    setSelectedAssetId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAssetId(null);
  };

  const updateAssetList = () => {
    fetchAssets();
  };

  return (
    <div style={styles.container}>
      {assets.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Serial No</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset._id}>
                <td style={styles.td}>{asset._id}</td>
                <td style={styles.td}>{asset.name}</td>
                <td style={styles.td}>{asset.description}</td>
                <td style={styles.td}>{asset.type}</td>
                <td style={styles.td}>{asset.serial_no}</td>
                <td style={styles.td}>{asset.Status ? 'Active' : 'Inactive'}</td>
                <td style={styles.td}>
                  <button 
                    onClick={() => handleUpdate(asset._id)} 
                    style={{ ...styles.actionButton, ...styles.updateButton }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                  >
                    Update
                  </button>
                  <button 
                    onClick={() => handleDelete(asset._id)} 
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
        <UpdateAssetModal
          assetId={selectedAssetId}
          onClose={closeModal}
          onUpdate={updateAssetList}
        />
      )}
    </div>
  );
}

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

export default AssetList;
