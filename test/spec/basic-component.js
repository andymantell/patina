var should = require('should');
var request = require('supertest')

var app = require('../../app/app');

describe('A basic component', function() {

  it('should have a demo rendered at /components/basic-component', function(done) {
    request(app)
      .get('/basic-component')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });

  it('should be listed on the index page', function(done) {
    request(app)
      .get('/')
      .expect(function(res) {
        res.text.should.containEql('<a href="/components/basic-component">A basic component</a>');
      })
      .end(done);
  });

});
