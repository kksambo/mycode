import React, { useState, useRef } from "react";
import "./AdminConsole.css"; // Make sure your CSS is appropriately styled

function AdminConsole() {
  // Define the type for the user
  interface User {
    id: string;
    username: string;
    email: string;
    role: string;
  }

  // Initial user data
  const [users, setUsers] = useState<User[]>([
    { id: "#001", username: "johndoe", email: "john@example.com", role: "Admin" },
    { id: "#002", username: "janedoe", email: "jane@example.com", role: "User" },
    { id: "#003", username: "mike99", email: "mike@example.com", role: "User" },
    { id: "#004", username: "alex42", email: "alex@example.com", role: "Admin" },
    { id: "#005", username: "johnnyboy", email: "johnny@example.com", role: "User" },
    { id: "#006", username: "katherine", email: "kath@example.com", role: "Admin" },
    { id: "#007", username: "sam123", email: "sam@example.com", role: "User" },
    { id: "#008", username: "bobcat", email: "bob@example.com", role: "User" },
    { id: "#009", username: "susan", email: "susan@example.com", role: "Admin" },
    { id: "#010", username: "chris99", email: "chris@example.com", role: "User" },
    { id: "#011", username: "mark45", email: "mark@example.com", role: "User" },
    { id: "#012", username: "lucas92", email: "lucas@example.com", role: "Admin" },
    { id: "#013", username: "zara45", email: "zara@example.com", role: "User" },
    { id: "#014", username: "nathan", email: "nathan@example.com", role: "User" },
    { id: "#015", username: "andrew", email: "andrew@example.com", role: "Admin" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Store the selected user for the modal
  const tableRef = useRef<HTMLTableElement | null>(null);

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle View button click
  const handleView = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      setSelectedUser(user); // Set the selected user to display in the modal
    }
  };

  // Handle Edit button click
  const handleEdit = (userId: string) => {
    console.log("Editing user with ID: " + userId);
  };

  // Handle Remove button click
  const handleRemove = (userId: string) => {
    console.log("Removing user with ID: " + userId);
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Remove user from state
  };

  // Scroll to the user ID when searched
  const scrollToUser = (userId: string) => {
    const row = tableRef.current?.querySelector(`tr[data-id="${userId}"]`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value) {
      scrollToUser(event.target.value); // Scroll to user if ID is typed
    }
  };

  return (
    <div className="containers">
      <nav className="navbar navbar-expand-lg navbar-dark px-4">
        <a className="navbar-brand" href="#">Admin Panel</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" href="#">Dashboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Users</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Activities</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Settings</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-danger" href="#">Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="text-center home-header mb-4">
        <h1>Admin Console</h1>
        <p className="lead">Manage users, view detailed info, and track activities</p>
      </div>

      {/* Search Box */}
      <div className="container mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by User ID"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* User Management Table */}
      <div className="container my-5">
        <h2 className="text-center text-primary mb-4">User Management</h2>
        <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "scroll" }}>
          <table ref={tableRef} className="table table-dark table-bordered">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: User) => (
                <tr key={user.id} data-id={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => handleView(user.id)}>
                      View
                    </button>
                    <button className="btn btn-warning btn-sm mx-2" onClick={() => handleEdit(user.id)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(user.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      {selectedUser && (
        <div className="modal fade show" id="userModal" tabIndex={-1} aria-labelledby="userModalLabel" aria-hidden="true" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="userModalLabel">User Information</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setSelectedUser(null)} // Close the modal
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>User ID:</strong> {selectedUser.id}</p>
                <p><strong>Username:</strong> {selectedUser.username}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setSelectedUser(null)} // Close the modal
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

<div>
        <h2 className="section-header">Recent User Activities</h2>
        <ul className="activity-list list-unstyled">
          <li><strong>johndoe</strong> updated a project at <em>10:45 AM</em></li>
          <li><strong>janedoe</strong> logged in at <em>9:30 AM</em></li>
          <li><strong>mike99</strong> removed a file at <em>8:15 AM</em></li>
          <li><strong>johndoe</strong> added a user at <em>Yesterday</em></li>
        </ul>
      </div>

      <footer>
        &copy; 2025 Admin Console. All rights reserved.
      </footer>
    </div>
  );
}

export default AdminConsole;
