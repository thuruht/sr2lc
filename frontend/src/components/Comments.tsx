import React, { useState, useEffect } from 'react';

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface CommentsProps {
  postId: string;
}

const Comments = ({ postId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const res = await fetch(`/api/comments/${postId}`);
    const data = await res.json();
    setComments(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/comments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ author, content }),
    });

    if (res.ok) {
      fetchComments();
      setAuthor('');
      setContent('');
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          placeholder="Your comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.author}</strong>
            <p>{comment.content}</p>
            <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;