import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (error) {
      console.error("Failed to fetch post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate("/");
    } catch (error) {
      alert("Not authorized to delete this post");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{post.title}</h2>
      <p>
        Author: {post.username} |{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {post.imageURL && (
        <img
          src={post.imageURL}
          alt="Post"
          style={{ maxWidth: "100%", marginTop: "10px" }}
        />
      )}

      <p style={{ marginTop: "20px" }}>{post.content}</p>

      {user && user.username === post.username && (
        <div style={{ marginTop: "20px" }}>
          <Link to={`/edit/${post._id}`}>Edit</Link>{" "}
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
