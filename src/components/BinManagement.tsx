import React, { useState, useEffect, useRef } from "react";
import "./AdminConsole.css"; // Ensure CSS is appropriately styled
import { Link, useNavigate } from "react-router-dom";

interface SmartBin {
  id: number;
  binCode: string;
  currentWeight: number;
  capacity: number;
  location: string;
  availability: string;
}

function BinManagement() {
  // State hooks
  const navigate = useNavigate();
  const [bins, setBins] = useState<SmartBin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null);

  // Refs
  const tableRef = useRef<HTMLTableElement | null>(null);

  // Fetch bins inside useEffect
  useEffect(() => {
    fetch("https://ledwaba-and-friends.onrender.com/api/smartbins")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch bins");
        }
        return response.json();
      })
      .then((data) => {
        setBins(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty dependency array to run only once on mount

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value) {
      scrollToBin(event.target.value); // Scroll to bin if ID is typed
    }
  };

  // Filter bins based on search term
  const filteredBins = bins.filter((bin) =>
    bin.binCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scroll to the bin when found
  const scrollToBin = (binCode: string) => {
    const row = tableRef.current?.querySelector(`tr[data-code="${binCode}"]`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Handle bin actions
  const handleView = (binId: number) => {
    const bin = bins.find((bin) => bin.id === binId);
    if (bin) {
      setSelectedBin(bin);
    }
  };

  const handleEdit = (binId: number) => {
    console.log("Editing bin with ID: " + binId);
  };

  const handleRemove = (binId: number) => {
    console.log("Removing bin with ID: " + binId);
    const isConfirmed: boolean = window.confirm("Are you sure you want to delete this bin?");
    if (isConfirmed) {
      // Make a DELETE request to the API to remove the bin
     
      fetch(`https://ledwaba-and-friends.onrender.com/api/deleteBin/${binId}`, {
        method: "DELETE", // HTTP method for delete
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete bin");
          }

          // If successful, update the local bins state
          setBins((prevBins) => prevBins.filter((bin) => bin.id !== binId));

          console.log("Bin deleted successfully");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
        <a className="navbar-brand" href="#">Bin Management</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" href="admin">Users</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="add-bin">AddBin</a>
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
        <h1>Bin Management</h1>
        <p className="lead">Manage bins, view detailed info, and track activities</p>
      </div>

      {/* Search Box */}
      <div className="container mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Bin Code"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Bin Management Table */}
      <div className="container my-5">
        <h2 className="text-center text-primary mb-4">Bin Management</h2>
        <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "scroll" }}>
          <table ref={tableRef} className="table table-dark table-bordered">
            <thead>
              <tr>
                <th>Bin ID</th>
                <th>Bin Code</th>
                <th>Current Weight</th>
                <th>Capacity</th>
                <th>Location</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBins.map((bin: SmartBin) => (
                <tr key={bin.id} data-code={bin.binCode}>
                  <td>{bin.id}</td>
                  <td>{bin.binCode}</td>
                  <td>{bin.currentWeight} kg</td>
                  <td>{bin.capacity} kg</td>
                  <td>{bin.location}</td>
                  <td>{bin.availability}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(bin.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Bin Modal */}
      {selectedBin && (
        <div className="modal fade show" id="binModal" tabIndex={-1} aria-labelledby="binModalLabel" aria-hidden="true" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="binModalLabel">Bin Information</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setSelectedBin(null)} // Close the modal
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Bin ID:</strong> {selectedBin.id}</p>
                <p><strong>Bin Code:</strong> {selectedBin.binCode}</p>
                <p><strong>Current Weight:</strong> {selectedBin.currentWeight} kg</p>
                <p><strong>Capacity:</strong> {selectedBin.capacity} kg</p>
                <p><strong>Location:</strong> {selectedBin.location}</p>
                <p><strong>Availability:</strong> {selectedBin.availability}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setSelectedBin(null)} // Close the modal
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BinManagement;
