import React, { useState } from "react";
import Addproduct from "./Addproduct";
import Listproduct from "./Listproduct";

const AdminPanel = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleProductAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
  return (
    <div className="admin-panel-container">

      <h2>Admin Dashboard</h2>
      <Addproduct onProductAdded={handleProductAdded} />
      <hr />
      <Listproduct refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default AdminPanel;
