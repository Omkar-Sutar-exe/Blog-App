const Post = require("../models/Post");

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const { title, imageURL, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    if (title.length < 5 || title.length > 120) {
      return res
        .status(400)
        .json({ message: "Title must be 5-120 characters" });
    }

    if (content.length < 50) {
      return res
        .status(400)
        .json({ message: "Content must be at least 50 characters" });
    }

    const post = await Post.create({
      title,
      imageURL,
      content,
      username: req.user.username,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL POSTS (Pagination + Search)
exports.getPosts = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 5 } = req.query;

    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ],
    };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE POST
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE POST (Owner Only)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found" });
    }

    if (post.username !== req.user.username) {
      return res
        .status(403)
        .json({ message: "Not authorized" });
    }

    const { title, imageURL, content } = req.body;

    post.title = title || post.title;
    post.imageURL = imageURL || post.imageURL;
    post.content = content || post.content;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE POST (Owner Only)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found" });
    }

    if (post.username !== req.user.username) {
      return res
        .status(403)
        .json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
