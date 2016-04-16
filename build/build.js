var extend = require('extend');
var path = require('path');
var cleanDist = require('./tasks/clean_dist');
var copy = require('./tasks/copy');
var generateSass = require('./tasks/generateSass');
var compileSass = require('./tasks/compileSass');
var javascript = require('./tasks/javascript');
var autoprefixer = require('./tasks/autoprefixer');
var componentBuilds = require('./tasks/componentBuilds');
var pkg_up = require('pkg-up');
var fs = require('fs');

module.exports = function(options) {

  /**
   * Default options for the build
   *
   * `components` is configuration for which components should be included in the
   * build. This defaults to only Govuk core stuff. The local build scripts also include
   * the "Build" category which contains styles for example pages
   */
  var config = extend({
    includePath: '',
    mode: 'production',
    cache: true,
    components: true,
    src: false,
    destination: 'dist',
    moduleDir: path.dirname(pkg_up.sync(__dirname)),
    assetPath: ''
  }, options);

  if(!config.src || !fs.existsSync(config.src)) {
    throw new Error('src directory does not exist');
    return;
  }

  // If we've not been passed an absolute path, make it a path relative to this module
  // if(!path.isAbsolute(config.destination)) {
  //   config.destination = path.join(config.moduleDir, config.destination);
  // }

  return new Promise(function(resolve, reject) {

    cleanDist(config)
      .then(function() {
        return componentBuilds(config);
      })
      .then(function() {
        return generateSass(config);
      })
      .then(function(stylesheets) {
        return compileSass(config, stylesheets);
      })
      .then(function() {
        return autoprefixer(config);
      })
      .then(function() {
        return javascript.compile(config);
      })
      .then(function() {
        resolve(path.join(config.destination, 'assets'));
      })
      .catch(function(e) {
        reject(e);
      });

  });
}
