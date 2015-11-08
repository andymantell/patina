var should = require('should');
var request = require('supertest')

var app = require('../../app/app');

describe('A basic component', function() {

  it('should have a demo rendered at /components/basic-component/basic-demo', function(done) {
    request(app)
      .get('/components/basic-component/basic-demo')
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .expect(function(res) {
        res.text.should.containEql('This is a basic component demo');
      })
      .end(done);
  });

  it('should be listed on the index page', function(done) {
    request(app)
      .get('/')
      .expect(function(res) {
        res.text.should.containEql('<a href="/components/basic-component/basic-demo">basic-component: basic-demo</a>');
      })
      .end(done);
  });

  it('should have documentation rendered on the component page', function(done) {
    (1).should.equal(2);
  });

});
