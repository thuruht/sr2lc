import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Shop from './pages/Shop';
import Blog from './pages/Blog';
import Post from './pages/Post';
import Login from './pages/Login';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import GalleryManagerPage from './pages/admin/GalleryManagerPage';
import ProductManagerPage from './pages/admin/ProductManagerPage';
import PostManagerPage from './pages/admin/PostManagerPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="gallery" element={<GalleryManagerPage />} />
          <Route path="products" element={<ProductManagerPage />} />
          <Route path="posts" element={<PostManagerPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;