var should = require('should');

describe('The test framework', function() {
  it('should run', function() {
    (5).should.be.exactly(5).and.be.a.Number();
  });
})
