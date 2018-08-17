const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {PORT, DATABASE_URL} = require('./config');
const {BlogPosts} = require('./models');

// Dummy entrys
BlogPosts.post('A Quick Test', 'This is, infact, a test. To be continued..', 'Thomas');
BlogPosts.post('A Second Test', 'This test is also a test. Send Help', 'Thomas');

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (field of requiredFields) {
    if (!(field in req.body)) {
      const message = `Missing "${field}" in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(
    req.body.title, req.body.content, req.body.author, req.body.publishDate
  );
  res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted shopping list item "${req.params.id}"`);
  res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
  for (field of requiredFields) {
    if (!(field in req.body)) {
      const message = `Missing "${field}" in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id and request body id must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post with id "${req.body.id}"`)
  BlogPosts.update({
    id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate,
  });
  res.status(204).end();
});

module.exports = router;