var components = require('../modules/components');
var sass = require('node-sass');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

function compileSass(done) {

  components.getComponentsTree()
    .then(function(componentsTree) {

      return new Promise(function(resolve, reject) {

        // Build up our sass imports based on the dependency tree
        var sassContents = [];
        componentsTree.forEach(function(componentId) {
          if(fs.existsSync(path.join('test/fixtures/example-site/src/components', componentId, 'style.scss'))) {
            sassContents.push('@import "' + componentId + '/style.scss";');
          }
        });

        // Turn the lines into a string suitable for passing to node-sass
        sassContents = sassContents.join('\n');

        // Compile
        sass.render({
          data: sassContents,
          includePaths: [
            'test/fixtures/example-site/src/components'
          ],
          outputStyle: 'compressed'
        }, function(err, result) {
          if(err) {
            reject(err);
            return;
          }

          // Write out the sass
          mkdirp('test/fixtures/example-site/dist/ui/css', function() {
            fs.writeFile('test/fixtures/example-site/dist/ui/css/style.css', result.css, function(err) {
              if(err) {
                reject(err);
                return;
              }

              resolve();
            });
          });
        });
      });
    })
    .then(done)
    .catch(function(e) {
      console.log(e);
    });
}

module.exports = compileSass;
