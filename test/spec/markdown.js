var should = require('should');
var request = require('supertest')

var app = require('../../app/app').server;

describe('Markdown', function() {

  it('should render correctly to html', function(done) {
    request(app)
      .get('/components/basic-component/basic-demo')
      .expect(function(res) {
        res.text.should.containEql('<p>This <em>markdown</em> <strong>string</strong> is here for the test suite</p>');
      })
      .end(done);
  });

});
