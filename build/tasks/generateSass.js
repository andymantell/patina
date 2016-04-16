var components = require('../modules/components');
var sass = require('node-sass');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

/**
 * Function to build out the SASS
 * @return {Promise} Promise which resolves with the collection of sass files
 */
function generateSass(config) {
  console.time('Generate SASS');

  mkdirp.sync(path.join(config.destination, 'assets/sass'));

  return components.getComponentsTree(config)
    .then(function(componentsTree) {

      return new Promise(function(resolve, reject) {

        var sassContents = [];

        // Inject our asset path variable
        sassContents.push('$assetPath: "' + config.assetPath + '";');

        // Build up our sass imports based on the dependency tree
        componentsTree.forEach(function(componentId) {

          // Check to see if the component exposes a stylesheet
          if(fs.existsSync(path.join(config.src, componentId, 'style.scss'))) {
            sassContents.push('@import "' + path.join(config.src, componentId) + '/style.scss";');
          }
        });

        // Turn the lines into a string suitable for passing to node-sass
        sassContents = sassContents.join('\n');

        if(sassContents.length === 0) {
          return Promise.resolve();
        }

        // Write out separate versions of the stylesheet for the various IEs
        var stylesheets = [
          {
            'filename': 'main',
            'base': '',
          }
        ];

        stylesheets.forEach(function(stylesheet) {
          stylesheet.data = stylesheet.base + sassContents;
          fs.writeFileSync(path.join(config.destination, 'assets/sass', stylesheet.filename) + '.scss', stylesheet.data);
        });

        console.timeEnd('Generate SASS');

        return resolve(stylesheets);
      });
    });
}

module.exports = generateSass;
