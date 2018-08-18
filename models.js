const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const authorSchema = mongoose.Schema({
  firstName: 'string',
  lastName: 'string',
  userName: {
    type: 'string',
    unique: true,
  },
});

const commentSchema = mongoose.Schema({content: 'string'});

const blogPostSchema = mongoose.Schema({
  title: 'string',
  content: 'string',
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
  comments: [commentSchema],
});

blogPostSchema.virtual('authorName').get(function() {
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

blogPostSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});

blogPostSchema.pre('find', function(next) {
  this.populate('author');
  next();
});

const Author = mongoose.model('Author', authorSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost, Author};