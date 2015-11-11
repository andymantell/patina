var should = require('should');
var request = require('supertest');
var fs = require('fs');

var sass = require('../../app/app').sass;

describe('Sass', function() {

  before(function(done) {
    sass(done);
  });

  it('should compile correctly to css', function(done) {
    fs.readFile('test/fixtures/example-site/dist/ui/css/style.css', 'utf8', function(err, data) {
      if (err) {
        throw new Error("Unable to read css output");
      }

      data.should.equal('a{color:#333}.basic-component{color:red}\n');

      done();
    });
  });

});
