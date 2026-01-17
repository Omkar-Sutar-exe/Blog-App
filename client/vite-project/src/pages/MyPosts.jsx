import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const MyPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPosts = async () => {
    try {
      const res = await api.get(
        `/posts?search=${user.username}&page=1&limit=50`
      );
      setPosts(
        res.data.posts.filter(
          (post) => post.username === user.username
        )
      );
    } catch (error) {
      console.error("Failed to fetch user posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Posts</h2>

      {posts.length === 0 && <p>You have no posts yet.</p>}

      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <h3>
            <Link to={`/posts/${post._id}`}>{post.title}</Link>
          </h3>
          <Link to={`/edit/${post._id}`}>Edit</Link>
        </div>
      ))}
    </div>
  );
};

export default MyPosts;
