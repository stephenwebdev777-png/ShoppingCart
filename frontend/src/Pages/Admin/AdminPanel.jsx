import React from "react";
import Addproduct from "./Addproduct";
import Listproduct from "./Listproduct";

const AdminPanel = () => {
  return (
    <div className="admin-panel-container">
      <h2>Admin Dashboard</h2>
      <Addproduct />
      <hr />
      <Listproduct />
    </div>
  );
};

export default AdminPanel;