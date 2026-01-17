import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    imageURL: "",
    content: "",
  });
  const [error, setError] = useState("");

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
      const res = await api.post("/posts", form);
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <br />

        <input
          name="imageURL"
          placeholder="Image URL (optional)"
          value={form.imageURL}
          onChange={handleChange}
        />
        <br />

        <textarea
          name="content"
          placeholder="Content"
          rows="6"
          value={form.content}
          onChange={handleChange}
        />
        <br />

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreatePost;
