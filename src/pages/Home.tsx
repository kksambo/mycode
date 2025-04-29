import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css"; 
import { useNavigate } from "react-router-dom";

function Home() {
 
  const [name, setName] = React.useState("Logout");
  const [email, setEmail] = React.useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    if (token && userEmail) {
      setName("Logout");
      setEmail(userEmail);
    } else {
      setName("login");
    }
  
    if (!token || !userEmail) {
      setName('login');
     
    }
  }, []);
  const navigate = useNavigate();

  const handleLogout = () => {

    if (name === "login") {
      navigate("/login");
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setEmail("");
    setName("login");

    
    navigate("/"); 
  };

  return (
    <div className="home-container">
<nav className="navbar navbar-expand-lg navbar-dark px-4">
  <a className="navbar-brand" href="#">{email}</a>
  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link className="nav-link active" to="/">Home</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/profile">Profile</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/dustbininteraction">Dispose</Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link text-danger"
          to={name === "Logout" ? "#" : `/${name}`}
          onClick={handleLogout}
        >
          {name}
        </Link>
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
