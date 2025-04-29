import React, { useState, useEffect, useRef } from "react";
import "./AdminConsole.css"; // Ensure CSS is appropriately styled
import { Link, useNavigate } from "react-router-dom";
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}


function AdminConsole() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const tableRef = useRef<HTMLTableElement | null>(null);

  useEffect(() => {
    fetch("https://ledwaba-and-friends.onrender.com/api/AppUsers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleRemove = (userId: number) => {
    const isConfirmed: boolean = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      setLoading(true); // Show loading spinner during the delete operation
      fetch(`https://ledwaba-and-friends.onrender.com/api/deleteUser/${userId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete user");
          }
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
          console.log("User deleted successfully");
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(error.message);
        })
        .finally(() => {
          setLoading(false); // Hide loading spinner after the operation
        });
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-border text-primary" role="status" style={{ width: "4rem", height: "4rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  const handleLogout = () => {



    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");


    
    navigate("/"); 
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
              <a className="nav-link active" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Activities</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="bins">Bins</a>
            </li>
            <Link
          className="nav-link text-danger"
          to="#"
          onClick={handleLogout}
        >
          Logout
        </Link>
          </ul>
        </div>
      </nav>

      <div className="text-center home-header mb-4">
        <h1>Admin Console</h1>
        <p className="lead">Manage users, view detailed info, and track activities</p>
      </div>

      <div className="container mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by User ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
              {users.map((user) => (
                <tr key={user.id} data-id={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
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
    </div>
  );
}

export default AdminConsole;
