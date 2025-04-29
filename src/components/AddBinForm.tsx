import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AddBinForm = () => {
  const [binCode, setBinCode] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!binCode || !currentWeight || !capacity || !location || !availability) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://ledwaba-and-friends.onrender.com/api/smartbins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          binCode: binCode,
          currentWeight: parseFloat(currentWeight),
          capacity: parseFloat(capacity),
          location: location,
          availability: availability,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add bin. Please try again.");
      }

      setSuccess("Bin added successfully!");
      setBinCode("");
      setCurrentWeight("");
      setCapacity("");
      setLocation("");
      setAvailability("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <nav className="navbar navbar-expand-lg navbar-dark px-4">
        <Link className="navbar-brand" to="#">Add Bin</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/bins">Bin Management</Link>
            </li>
          </ul>
        </div>
      </nav>
      <center>
        <h2>Add Bin</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Bin Code</label>
            <input
              type="text"
              className="form-control"
              value={binCode}
              onChange={(e) => setBinCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Current Weight (kg)</label>
            <input
              type="number"
              className="form-control"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Capacity (kg)</label>
            <input
              type="number"
              className="form-control"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Availability</label>
            <select
              className="form-control"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              required
            >
              <option value="">Select Availability</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
          <div className="login-actions">
            <button type="submit" className="btn btn-primary">
              Add Bin
            </button>
            <button
              type="button"
              className="btn btn-link"
              onClick={() => navigate("/bin-management")}
            >
              Go to Bin Management
            </button>
          </div>
        </form>
      </center>
    </div>
  );
};

export default AddBinForm;