import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setItems(data);
    };
    fetchItems();
  }, []);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const slides = items.map((item) => ({
    src: item.imageUrl,
    title: item.title,
    description: item.description,
  }));

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  return (
    <div>
      <h1>Gallery</h1>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {items.map((item, index) => (
          <div key={item.id} onClick={() => openLightbox(index)}>
            <img src={item.imageUrl} alt={item.title} />
          </div>
        ))}
      </Masonry>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={currentIndex}
      />
    </div>
  );
};

export default Gallery;