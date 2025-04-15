import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; 
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    
    navigate("/"); 
  };

  return (
    <div className="home-container">
<nav class="navbar navbar-expand-lg navbar-dark px-4">
    <a class="navbar-brand" href="#">Admin Panel</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/profile">Profile</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/dustbininteraction">Dispose</a>
        </li>
        <li class="nav-item">
        <a
              className="nav-link text-danger"
              href="#"
              onClick={handleLogout} 
            >
              Logout
            </a>
        </li>
      </ul>
    </div>
  </nav>
      <div className="home-header">
        <h1>Welcome to the Trash Management System</h1>
        <p className="lead">
          Manage waste efficiently with smart dustbins and IoT technology.
        </p>
      </div>
      <div className="home-features">
        <h2>Features</h2>
        <ul>
          <li>User Registration</li>
          <li>Smart Dustbin Interaction</li>
          <li>Data Transmission using IoT Technology</li>
          <li>Rewards for Waste Disposal</li>
        </ul>
      </div>
      <div className="home-actions">
        <h2>Get Started</h2>
        <Link to="/register" className="btn btn-primary">
          Register
        </Link>
        <Link to="/admin" className="btn btn-secondary ml-2">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;