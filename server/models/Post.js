const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 120,
      trim: true,
    },
    imageURL: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
      minlength: 50,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
