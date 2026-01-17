const express = require("express");
const cors = require("cors");
const postRoutes = require("./routes/postRoutes")
const app = express();
const authRoutes = require("./routes/authRoutes")


// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;




