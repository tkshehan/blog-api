const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Author} = require('./models');

router.post('/', (req, res) => {
  const requiredFields = ['firstName', 'lastName', 'userName'];
  for (field of requiredFields) {
    if (!(field in req.body)) {
      const message = `Missing "${field}" in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Author
    .findOne({userName: req.body.userName})
    .then(author => {
      if (author) {
        const message = `Username ${req.body.userName} is already taken`;
        console.error(message);
        return res.status(400).send(message);
      } else {
        Author
          .create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
          })
          .then(author => res.json(author.serialize()))
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.put('/:id', (req, res) => {
  if (req.params.id !== req.body.id) {
    const message = `Request path id and request body id must match`;
    console.error(message);
    return res.status(400).send(message);
  }

  const toUpdate = {};
  const updateableFields = ['firstName', 'lastName', 'userName'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Author
    .findOne({userName: req.body.userName})
    .then(author => {
      if (author) {
        const message = `Username ${req.body.userName} already taken`;
        console.error(message);
        return res.status(400).send(message);
      } else {
        Author
          .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
          .then(author => {
            return res.json({
              _id: req.params.id,
              name: `${author.firstName} ${author.lastName}`,
              userName: author.userName,
            });
          })
      }
    })
    .catch(err => res.status(500).json({message: 'Internal server error'}))
});

router.delete('/:id', (req, res) => {
  BlogPost
    .remove({author: req.params.id})
    .then(function() {
      Author
        .findByIdAndRemove(req.params.id)
    })
    .then(function() {
      res.status(204).message(`Deleted User and Blogposts of UserId ${req.params.id}`);
    })
    .catch(err => res.status(500).json({message: 'Internal server error'}))
});

module.exports = router;