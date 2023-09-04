const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog must be have a name."],
    },
    description: {
      type: String,
      required: [true, "Blog must be have a description."],
    },
    blogCategory: {
      type: String,
      required: [true, "Blog must be have a type."],
    },
    numberOfViews: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      default: "https://semantic-ui.com/images/avatar2/large/elyse.png",
    },
    autho: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
