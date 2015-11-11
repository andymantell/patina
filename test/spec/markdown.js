var should = require('should');
var request = require('supertest')

var app = require('../../app/app');

describe('Markdown', function() {

  // TODO: Remove this. This a hideous hack to get around the intial asynchronous work that is done upon launching the server.
  before(function(done) {
    setTimeout(done, 1000);
  });

  it('should render correctly to html', function(done) {
    request(app)
      .get('/components/basic-component/basic-demo')
      .expect(function(res) {
        res.text.should.containEql('<p>This <em>markdown</em> <strong>string</strong> is here for the test suite</p>');
      })
      .end(done);
  });

});
