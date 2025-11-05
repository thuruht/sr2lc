import React, { useState } from 'react'

interface GalleryItem {
  id: number
  title: string
  description: string
  imageUrl: string
}

interface EditItemFormProps {
  item: GalleryItem
  onUpdate: () => void
}

function EditItemForm({ item, onUpdate }: EditItemFormProps) {
  const [title, setTitle] = useState(item.title)
  const [description, setDescription] = useState(item.description)
  const [imageUrl, setImageUrl] = useState(item.imageUrl)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch(`/api/gallery/${item.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, imageUrl }),
      }
    ).then(() => {
      onUpdate()
    })
  }

  return (
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
      <button type="submit">Update Item</button>
    </form>
  )
}

export default EditItemForm
