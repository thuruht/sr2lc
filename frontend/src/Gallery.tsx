import React, { useEffect, useState } from 'react'
import EditItemForm from './EditItemForm'

interface GalleryItem {
  id: number
  title: string
  description: string
  imageUrl: string
}

function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)

  const fetchGalleryItems = () => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => setGalleryItems(data))
  }

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch('/api/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, imageUrl }),
    }).then(() => {
      fetchGalleryItems()
      setTitle('')
      setDescription('')
      setImageUrl('')
    })
  }

  const handleDelete = (id: number) => {
    fetch(`/api/gallery/${id}`, {
      method: 'DELETE',
    }).then(() => {
      fetchGalleryItems()
    })
  }

  const handleUpdate = () => {
    setEditingItem(null)
    fetchGalleryItems()
  }

  return (
    <div>
      <h1>Gallery</h1>
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
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button type="submit">Add Item</button>
      </form>
      <div>
        {galleryItems.map((item) => (
          <div key={item.id}>
            {editingItem?.id === item.id ? (
              <EditItemForm item={item} onUpdate={handleUpdate} />
            ) : (
              <div>
                <img src={item.imageUrl} alt={item.title} />
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <button onClick={() => setEditingItem(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Gallery
