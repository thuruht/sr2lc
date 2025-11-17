import React, { useState, useEffect } from 'react';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const GalleryManager = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch('/api/gallery');
    const data = await res.json();
    setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    const url = editingItem ? `/api/gallery/${editingItem.id}` : '/api/gallery';
    const method = editingItem ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      body: formData,
    });

    if (res.ok) {
      fetchItems();
      setTitle('');
      setDescription('');
      setImage(null);
      setEditingItem(null);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchItems();
    }
  };

  return (
    <div>
      <h2>Manage Gallery</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
        <button type="submit">{editingItem ? 'Update Item' : 'Create Item'}</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <img src={item.imageUrl} alt={item.title} width="100" />
            {item.title}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GalleryManager;