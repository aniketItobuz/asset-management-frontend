import React, { useState } from 'react';
import EmployeeTable from './component/EmployeeList.jsx';
import AddEmployee from './component/AddEmployee.jsx';
import AssetList from './component/AssetList.jsx';
import AddAsset from './component/AddAsset.jsx';
import AssetAssign from './component/AssetAssign.jsx';
import AssetHistory from './component/AssetHistoryDisplay.jsx';
import './App.css'; // Import custom CSS for the modern look

function App() {
  const [activeTab, setActiveTab] = useState('employees');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);

  return (
    <div className="app-container">
      <h1 className="app-title">Asset Management System</h1>

      {/* Tabs for Employees, Assets, Asset Assignments, and Asset History */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('employees');
            setShowAddEmployee(false);
            setShowAddAsset(false);
          }}
        >
          <i className="fas fa-users"></i> Employee Management
        </button>
        <button
          className={`tab-button ${activeTab === 'assets' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('assets');
            setShowAddEmployee(false);
            setShowAddAsset(false);
          }}
        >
          <i className="fas fa-box"></i> Asset Management
        </button>
        <button
          className={`tab-button ${activeTab === 'assign' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('assign');
            setShowAddEmployee(false);
            setShowAddAsset(false);
          }}
        >
          <i className="fas fa-tasks"></i> Assign Asset
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('history');
            setShowAddEmployee(false);
            setShowAddAsset(false);
          }}
        >
          <i className="fas fa-history"></i> Asset History
        </button>
      </div>

      {/* Conditional rendering based on the active tab */}
      <div className="tab-content">
        {activeTab === 'employees' && (
          <div className="employee-section">
            <div className="section-header">
              <h2>Employee List</h2>
              <button
                className="add-button"
                onClick={() => setShowAddEmployee(prev => !prev)}
              >
                <i className="fas fa-plus"></i> {showAddEmployee ? 'Cancel' : 'Add New Employee'}
              </button>
            </div>
            {showAddEmployee ? <AddEmployee /> : <EmployeeTable />}
          </div>
        )}
        {activeTab === 'assets' && (
          <div className="asset-section">
            <div className="section-header">
              <h2>Asset List</h2>
              <button
                className="add-button"
                onClick={() => setShowAddAsset(prev => !prev)}
              >
                <i className="fas fa-plus"></i> {showAddAsset ? 'Cancel' : 'Add New Asset'}
              </button>
            </div>
            {showAddAsset ? <AddAsset /> : <AssetList />}
          </div>
        )}
        {activeTab === 'assign' && (
          <div className="assign-section">
            <AssetAssign />
          </div>
        )}
        {activeTab === 'history' && (
          <div className="history-section">
            <AssetHistory />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
