import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Post {
  id: number;
  title: string;
  content: string;
}

const PostManager = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts';
    const method = editingPost ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      fetchPosts();
      setTitle('');
      setContent('');
      setEditingPost(null);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchPosts();
    }
  };

  return (
    <div>
      <h2>Manage Posts</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ReactQuill value={content} onChange={setContent} />
        <button type="submit">{editingPost ? 'Update Post' : 'Create Post'}</button>
      </form>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title}
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostManager;