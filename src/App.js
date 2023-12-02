import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const toggleRowSelection = (userId) => {
    const isSelected = selectedRows.includes(userId);
    if (isSelected) {
      setSelectedRows(selectedRows.filter(id => id !== userId));
    } else {
      setSelectedRows([...selectedRows, userId]);
    }
  };

  const handleSelectAll = () => {
    const allRowsSelected = selectedRows.length === paginatedUsers.length;
    if (allRowsSelected) {
      setSelectedRows([]);
    } else {
      const allUserIds = paginatedUsers.map(user => user.id);
      setSelectedRows(allUserIds);
    }
  };

  const [editableRow, setEditableRow] = useState(null);

  const handleEdit = (userId) => {
    setEditableRow(userId);
  };

  const handleEditChange = (userId, value) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, name: value } : user
    );
    setUsers(updatedUsers);
  };

  const handleSave = (userId) => {
    setEditableRow(null);
  };

  const handleDelete = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(user => !selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setSelectedRows([]);
  };

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="admin-dashboard">
      <div className="search-and-select">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label>
          <input
            className="select-all"
            type="checkbox"
            onChange={handleSelectAll}
            checked={selectedRows.length === paginatedUsers.length && paginatedUsers.length > 0}
          />
        </label>
      </div>

      <div className="user-table headings">
        <div></div>
        <div>ID</div>
        <div>Name</div>
        <div>Email</div>
        <div>Role</div>
        <div>Action</div>
      </div>

      {paginatedUsers.map(user => (
        <div key={user.id} className={`user-table-row ${selectedRows.includes(user.id) ? 'selected-row' : ''}`}>
          <div>
            <input
              type="checkbox"
              onChange={() => toggleRowSelection(user.id)}
              checked={selectedRows.includes(user.id)}
            />
          </div>
          <div>{user.id}</div>
          <div>
            {editableRow === user.id ? (
              <input
                type="text"
                value={user.name}
                onChange={(e) => handleEditChange(user.id, e.target.value)}
              />
            ) : (
              user.name
            )}
          </div>
          <div>{user.email}</div>
          <div>{user.role}</div>
          <div>
            {editableRow === user.id ? (
              <button className="save-btn" onClick={() => handleSave(user.id)}>
                Save
              </button>
            ) : (
              <>
                <button className="edit-btn" onClick={() => handleEdit(user.id)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          First
        </button>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button key={number} onClick={() => setCurrentPage(number)} className={currentPage === number ? 'active' : ''}>
            {number}
          </button>
        ))}
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
          Last
        </button>
      </div>

      <button className="delete-selected" onClick={handleDeleteSelected}>
        Delete Selected
      </button>
    </div>
  );
}

export default App;
