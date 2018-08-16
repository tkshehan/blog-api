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

  it('should list Posts on GET');

  it('should add a Post on POST');

  it('should update a Post on PUT');

  it('should delete a Post on DELETE');

});