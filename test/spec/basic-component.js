var should = require('should');
var request = require('supertest')

var app = require('../../app/app');

describe('A basic component', function() {

  // TODO: Remove this. This a hideous hack to get around the intial asynchronous work that is done upon launching the server.
  before(function(done) {
    setTimeout(done, 1000);
  });

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
        res.text.should.containEql('<a href="/components/basic-component/basic-demo">Basic</a>');
      })
      .end(done);
  });

  it('should have documentation rendered on the component page', function(done) {
    request(app)
      .get('/components/basic-component/basic-demo')
      .expect(function(res) {
        res.text.should.containEql('This is the README.md file for this basic component.');
      })
      .end(done);

  });

});
