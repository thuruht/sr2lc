import React, { useState, useEffect } from 'react';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setItems(data);
    };
    fetchItems();
  }, []);

  return (
    <div>
      <h1>Gallery</h1>
      <div>
        {items.map((item) => (
          <div key={item.id}>
            <img src={item.imageUrl} alt={item.title} />
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
