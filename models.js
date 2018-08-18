const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String,
  },
  created: String,
});

blogPostSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.serialize = function() {
  return {
    title: this.title,
    content: this.content,
    author: this.authorString,
    created: this.created,
  };
};

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = {BlogPost};