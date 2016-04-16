module.exports = {
  build: function(config) {
    return require('./build/build')(config);
  },
  server: function(config) {
    return require('./build/server')(config);
  }
}
