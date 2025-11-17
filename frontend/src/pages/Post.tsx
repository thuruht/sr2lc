import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Comments from '../components/Comments';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';

interface PostData {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

const Post = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostData | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      setPost(data);
    };
    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{new Date(post.createdAt).toLocaleDateString()}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <div>
        <FacebookShareButton url={window.location.href}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={window.location.href}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <LinkedinShareButton url={window.location.href}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </div>
      <Comments postId={id!} />
    </div>
  );
};

export default Post;
