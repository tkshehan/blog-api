const express = require('express');
const morgan = require('morgan');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const app = express();

const {PORT, DATABASE_URL} = require('./config');
const postsRouter = require('./postsRouter');
const authorsRouter = require('.authorsRouter');

app.use(morgan('common'));
app.use(express.json());

app.use('/posts', postsRouter);
app.use('/authors', authorsRouter);

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      function(err) {
        if (err) {return reject(err)}
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    return mongoose.disconnect().then(function() {
      console.log('Closing Server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}



if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};