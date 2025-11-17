import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price.toString());
    if (image) {
      formData.append('image', image);
    }

    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      body: formData,
    });

    if (res.ok) {
      fetchProducts();
      setName('');
      setDescription('');
      setPrice(0);
      setImage(null);
      setEditingProduct(null);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchProducts();
    }
  };

  return (
    <div>
      <h2>Manage Products</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ReactQuill value={description} onChange={setDescription} />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
        <button type="submit">{editingProduct ? 'Update Product' : 'Create Product'}</button>
      </form>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <img src={product.imageUrl} alt={product.name} width="100" />
            {product.name}
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;