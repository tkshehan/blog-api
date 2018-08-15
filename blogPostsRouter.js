const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// Dummy entry
BlogPosts.create('A quick test', 'This is, infact, a test.', 'Thomas');

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
    req.body.title, req.body.content, req.body.author, req.body.id
  );
  res.status(201).json(item);
});

router.delete('/:id', (req, res) => {

});

router.put('/:id', jsonParser, (req, res) => {

});

module.exports = router;