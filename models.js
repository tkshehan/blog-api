const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {type: String, required: true},
  publishDate: String,
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = {BlogPost};