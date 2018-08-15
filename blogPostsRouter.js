const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// Dummy entry
BlogPosts.create('A quick test', 'This is, infact, a test.', 'Thomas');

router.get('/', (req, res) => {

});

router.post('/', jsonParser, (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', jsonParser, (req, res) => {

});

module.exports = router;