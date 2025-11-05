import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/admin/gallery">Manage Gallery</Link>
          </li>
          <li>
            <Link to="/admin/products">Manage Products</Link>
          </li>
          <li>
            <Link to="/admin/posts">Manage Posts</Link>
          </li>
          <li>
            <Link to="/admin/bio">Manage Bio</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default AdminDashboard;
