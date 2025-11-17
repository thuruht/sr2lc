import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <ul>
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/gallery">Manage Gallery</Link>
          </li>
          <li>
            <Link to="/admin/products">Manage Products</Link>
          </li>
          <li>
            <Link to="/admin/posts">Manage Posts</Link>
          </li>
        </ul>
      </nav>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;