import React, { useState, useEffect } from 'react';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const GalleryManager = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    // fetch items
  }, []);

  return (
    <div>
      <h2>Manage Gallery</h2>
      {/* Add form and list of items */}
    </div>
  );
};

export default GalleryManager;
