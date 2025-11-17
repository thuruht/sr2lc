import React, { useState, useEffect } from 'react';

interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface ReviewsProps {
  productId: number;
}

const Reviews = ({ productId }: ReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews/${productId}`);
    const data = await res.json();
    setReviews(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/reviews/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ author, rating, content }),
    });

    if (res.ok) {
      fetchReviews();
      setAuthor('');
      setRating(5);
      setContent('');
    }
  };

  return (
    <div>
      <h3>Customer Reviews</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value={5}>5 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={2}>2 Stars</option>
          <option value={1}>1 Star</option>
        </select>
        <textarea
          placeholder="Your review"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <strong>{review.author}</strong> - {review.rating}/5
            <p>{review.content}</p>
            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;