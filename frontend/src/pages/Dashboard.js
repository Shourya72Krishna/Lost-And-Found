import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state for Add Item
  const [form, setForm] = useState({
    itemName: "",
    description: "",
    type: "Lost",
    location: "",
    contactInfo: "",
  });

  // Edit state
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Fetch all items on load
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data);
    } catch (err) {
      setError("Failed to load items");
    }
  };

  // Handle Add Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await API.post("/items", form);
      setSuccess("Item added successfully!");
      setForm({ itemName: "", description: "", type: "Lost", location: "", contactInfo: "" });
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`/items/${id}`);
      setSuccess("Item deleted!");
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  // Handle Edit - open edit form
  const handleEditClick = (item) => {
    setEditId(item._id);
    setEditForm({
      itemName: item.itemName,
      description: item.description,
      type: item.type,
      location: item.location,
      contactInfo: item.contactInfo,
    });
  };

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/items/${editId}`, editForm);
      setSuccess("Item updated!");
      setEditId(null);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  // Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await API.get(`/items/search?name=${searchQuery}`);
      setItems(res.data);
    } catch (err) {
      setError("Search failed");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      {/* Navbar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>📦 Lost & Found - Dashboard</h4>
        <div>
          <span className="me-3">Welcome, <strong>{user?.name}</strong></span>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Add Item Form */}
      <div className="card p-3 mb-4">
        <h5>Add New Item</h5>
        <form onSubmit={handleAddItem}>
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Item Name"
                value={form.itemName}
                onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Contact Info"
                value={form.contactInfo}
                onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                Add Item
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Search Bar */}
      <div className="card p-3 mb-4">
        <form onSubmit={handleSearch} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or type (Lost/Found)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">Search</button>
          <button type="button" className="btn btn-outline-secondary" onClick={fetchItems}>
            Reset
          </button>
        </form>
      </div>

      {/* Items Table */}
      <div className="card p-3">
        <h5>All Items</h5>
        {items.length === 0 ? (
          <p className="text-muted">No items found.</p>
        ) : (
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Item Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Posted By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  {editId === item._id ? (
                    // Inline edit row
                    <>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={editForm.itemName}
                          onChange={(e) => setEditForm({ ...editForm, itemName: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        />
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={editForm.type}
                          onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                        >
                          <option value="Lost">Lost</option>
                          <option value="Found">Found</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={editForm.contactInfo}
                          onChange={(e) => setEditForm({ ...editForm, contactInfo: e.target.value })}
                        />
                      </td>
                      <td>{item.postedBy?.name || "N/A"}</td>
                      <td>
                        <button className="btn btn-success btn-sm me-1" onClick={handleUpdate}>
                          Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    // Normal display row
                    <>
                      <td>{item.itemName}</td>
                      <td>{item.description}</td>
                      <td>
                        <span className={`badge ${item.type === "Lost" ? "bg-danger" : "bg-success"}`}>
                          {item.type}
                        </span>
                      </td>
                      <td>{item.location}</td>
                      <td>{item.contactInfo}</td>
                      <td>{item.postedBy?.name || "N/A"}</td>
                      <td>
                        {item.postedBy?._id === user?.id && (
                          <>
                            <button
                              className="btn btn-warning btn-sm me-1"
                              onClick={() => handleEditClick(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(item._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
