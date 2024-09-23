import React, { useState } from 'react';
import EmployeeTable from './component/EmployeeList.jsx';
import AddEmployee from './component/AddEmployee.jsx';
import AssetList from './component/AssetList.jsx';
import AddAsset from './component/AddAsset.jsx';
import AssetAssign from './component/AssetAssign.jsx';
import AssetHistory from './component/AssetHistoryDisplay.jsx';
import Login from './component/Login.jsx';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('employees');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  const handleLogin = (token) => {
    setToken(token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken('');
  };

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <h1 className="app-title">Asset Management System</h1>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>

          <div className="tabs">
            {['employees', 'assets', 'assign', 'history'].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab);
                  setShowAddEmployee(false);
                  setShowAddAsset(false);
                }}
              >
                <i className={`fas fa-${tab === 'employees' ? 'users' : tab === 'assets' ? 'box' : tab === 'assign' ? 'tasks' : 'history'}`}></i>
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')} Management
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'employees' && (
              <div className="employee-section">
                <div className="section-header">
                  <h2>Employee List</h2>
                  <button className="add-button" onClick={() => setShowAddEmployee((prev) => !prev)}>
                    <i className="fas fa-plus"></i> {showAddEmployee ? 'Cancel' : 'Add New Employee'}
                  </button>
                </div>
                {showAddEmployee ? <AddEmployee /> : <EmployeeTable token={token} />}
              </div>
            )}
            {activeTab === 'assets' && (
              <div className="asset-section">
                <div className="section-header">
                  <h2>Asset List</h2>
                  <button className="add-button" onClick={() => setShowAddAsset((prev) => !prev)}>
                    <i className="fas fa-plus"></i> {showAddAsset ? 'Cancel' : 'Add New Asset'}
                  </button>
                </div>
                {showAddAsset ? <AddAsset /> : <AssetList token={token} />}
              </div>
            )}
            {activeTab === 'assign' && <AssetAssign token={token} />}
            {activeTab === 'history' && <AssetHistory token={token} />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
