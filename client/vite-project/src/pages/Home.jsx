import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/posts?search=${search}&page=${page}&limit=5`
      );
      setPosts(res.data.posts);
      setPages(res.data.pages);
    } catch (error) {
      console.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search, page]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Blog Posts</h2>

      <input
        placeholder="Search by title or author"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      {loading && <p>Loading...</p>}

      {!loading && posts.length === 0 && <p>No posts found</p>}

      {!loading &&
        posts.map((post) => (
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
            <p>Author: {post.username}</p>
            <p>{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        ))}

      {/* Pagination */}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span> Page {page} of {pages} </span>
        <button
          disabled={page === pages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
