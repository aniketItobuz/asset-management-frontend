import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateAssetModal from './UpdateAssetModal.jsx'; // Import the UpdateAssetModal component

function AssetList() {
  const [assets, setAssets] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // States for pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Items per page
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAssets();
    fetchAssetTypes();
  }, [page, limit]); // Re-fetch assets when page or limit changes

  const fetchAssets = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/asset/get-all`, {
        params: {
          page: page, // Send page as query param
          limit: limit, // Send limit as query param
        },
      });
      setAssets(response.data.data);
      setTotalPages(response.data.meta.totalPages); // Set total pages from response
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchAssetTypes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/assetType/get-all`);
      setAssetTypes(response.data.data);
    } catch (error) {
      console.error('Error fetching asset types:', error);
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

  const getAssetTypeTitle = (typeId) => {
    const type = assetTypes.find(t => t._id === typeId);
    return type ? type.title : 'Unknown';
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
      {assets.length > 0 ? (
        <>
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
                  <td style={styles.td}>{getAssetTypeTitle(asset.type)}</td>
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
  }
};

export default AssetList;
