const chai = require("chai");
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

let storedId;
let expectedLength;
describe('Blog Posts', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list Posts on GET', function() {
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(res) {
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        res.body.forEach(function(post) {
          expect(post).to.be.a('object');
          expect(post).to.include.all.keys([
            'id',
            'title',
            'content',
            'author',
            'publishDate'
          ]);
        });
        // For testing PUT
        expectedLength = res.body.length;
      });
  });

  it('should add a Post on POST', function() {
    const newPost = {
      title: 'A Test To Remember',
      author: 'Test-Server.js feat. Thomas',
      content: 'It was the test of times, it was the worst of times...',
      publishDate: 3
    }
    return chai
      .request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.all.keys([
          'id', 'title', 'author', 'content', 'publishDate'
        ])
        expect(res.body).to.deep.equal(
          Object.assign(newPost, {id: res.body.id})
        );
        // Save for later testing
        storedId = res.body.id;
        expectedLength++;
      });
  });

  it('should update a Post on PUT', function() {
    const updatedPost = {
      title: 'A Test To Remember(We Forgot A Few Things)',
      author: 'Test-Server.js feat. Thomas',
      content: `It was the test of times, it was the worst of times...`,
      publishDate: 333,
      id: storedId,
    }
    return chai
      .request(app)
      .put(`/blog-posts/${storedId}`)
      .send(updatedPost)
      .then(function(res) {
        expect(res).to.have.a.status(204);
        expect(res.body).to.be.empty;
      })
      .then(function() {
        return chai
          .request(app)
          .get('/blog-posts')
      })
      .then(function(res) {
        expect(res.body.length).to.equal(expectedLength);
        expect(res.body).to.deep.include(updatedPost);
      })
  });

  it('should delete a Post on DELETE', function() {
    return chai
      .request(app)
      .delete(`/blog-posts/${storedId}`)
      .then(function(res) {
        expect(res).to.have.a.status(204);
        expect(res.body).to.be.empty;
      })
      .then(function() {
        return chai.request(app)
          .get('/blog-posts');
      })
      .then(function(res) {
        expectedLength--;
        expect(res.body.length).to.equal(expectedLength);
        res.body.forEach(function(post) {
          expect(post.id).to.not.equal(storedId);
        });
      });
  });

});