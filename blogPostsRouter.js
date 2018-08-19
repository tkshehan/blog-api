const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPost, Author} = require('./models');

router.get('/', (req, res) => {
  BlogPost.find()
    .limit(10)
    .then(blogPosts => {
      res.json({
        blogPosts: blogPosts.map(post => post.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.get('/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .then(blogPost => res.json(blogPost.serializeOne()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author_id'];
  for (field of requiredFields) {
    if (!(field in req.body)) {
      const message = `Missing "${field}" in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Author.findById({_id: req.body.author_id})
    .then(author => {
      if (!(author)) {
        const message = `Invalid author_id`;
        console.error(message);
        return res.status(400).send(message);
      }
    })
    .then(function() {
      BlogPost.create({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author_id,
        publishDate: req.body.publishDate || Date.now(),
      })
        .then(blogPost => {
          BlogPost
            .findById(blogPost._id)
            .then(blogPost => res.json(blogPost.serialize()))
            .catch(err => {
              console.error(err);
              res.status(500).json({message: 'Internal server error'});
            });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({message: 'Internal server error'});
        });
    });
});

router.put('/:id', jsonParser, (req, res) => {
  if (req.params.id !== req.body.id) {
    const message = `Request path id and request body id must match`;
    console.error(message);
    return res.status(400).send(message);
  }

  const toUpdate = {};
  const updateableFields = ['title', 'content', 'author', 'publishDate'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  console.log(`Updating blog post with id "${req.body.id}"`)
  BlogPosts
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(blogPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}))
});

router.delete('/:id', (req, res) => {
  BlogPosts.findByIdAndRemove(req.params.id)
    .then(blogPost => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}))
});

module.exports = router;