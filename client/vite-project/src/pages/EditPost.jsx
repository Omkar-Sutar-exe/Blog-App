import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    imageURL: "",
    content: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setForm({
          title: res.data.title,
          imageURL: res.data.imageURL,
          content: res.data.content,
        });
      } catch {
        setError("Failed to load post");
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.title.length < 5) {
      return setError("Title must be at least 5 characters");
    }
    if (form.content.length < 50) {
      return setError("Content must be at least 50 characters");
    }

    try {
      await api.put(`/posts/${id}`, form);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
        />
        <br />

        <input
          name="imageURL"
          value={form.imageURL}
          onChange={handleChange}
        />
        <br />

        <textarea
          name="content"
          rows="6"
          value={form.content}
          onChange={handleChange}
        />
        <br />

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditPost;
