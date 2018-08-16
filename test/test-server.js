const chai = require("chai");
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

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
      });
  });

  it('should add a Post on POST');

  it('should update a Post on PUT');

  it('should delete a Post on DELETE');

});