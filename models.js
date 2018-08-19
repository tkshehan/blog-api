const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const authorSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: {
    type: String,
    unique: true,
  },
});

authorSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

authorSchema.methods.serialize = function() {
  return {
    _id: this._id,
    name: this.name,
    userName: this.userName,
  };
};

const commentSchema = mongoose.Schema({content: String});

const blogPostSchema = mongoose.Schema({
  title: String,
  content: String,
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author'},
  comments: [commentSchema],
  created: Date,
});

blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.serialize = function() {
  return {
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.created,
  };
};

blogPostSchema.methods.serializeOne = function() {
  return {
    title: this.title,
    content: this.content,
    author: this.authorName,
    created: this.created,
    comments: this.comments,
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
const BlogPost = mongoose.model('Post', blogPostSchema);

module.exports = {BlogPost, Author};