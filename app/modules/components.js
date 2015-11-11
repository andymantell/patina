var yfm = require('yfm');
var yaml = require('js-yaml');
var glob = require('glob');
var path = require('path');
var fs = require('fs');

/**
 * Function to return config and data for a single component
 * @param {String} component The component ID to fetch
 * @return {Promise} Promise which resolves with the component data
 */
function getComponent(name) {
  return new Promise(function(resolve, reject) {

    var componentPath = path.join('test/fixtures/example-site/src/components', name);

    var component = yaml.safeLoad(fs.readFileSync(path.join(componentPath, 'component.yaml'), 'utf8'));

    component.id = name;

    component.template = fs.readFileSync(path.join(componentPath, 'template.hbs'), 'utf8');

    var readmePath = path.join(componentPath, 'README.md');
    if(fs.existsSync(readmePath)) {
      component.readme = fs.readFileSync(readmePath, 'utf8');
    }

    component.variants = {};

    // Register component demo variants
    glob(path.join(componentPath, 'demos/*.hbs'), function(er, files) {
      files.forEach(function(demoFilename) {

        var variantHTML = fs.readFileSync(demoFilename, 'utf8');
        var variantData = yfm(variantHTML);

        var variantName = path.basename(demoFilename, path.extname(demoFilename));

        component.variants[variantName] = {
          name: variantData.context.title ? variantData.context.title : variantName,
          href: '/components/' + name + '/' + variantName,
          content: variantData.content,
          context: variantData.context
        };
      });

      if(er) {
        reject(er)
      } else {
        resolve(component);
      }
    });
  });
}

/**
 * Function to return config and data for all enabled components
 * @return {Promise} Promise which resolves with all the component data
 */
function getComponents() {
  return new Promise(function(resolve, reject) {
    glob('test/fixtures/example-site/src/components/**/component.yaml', function (er, files) {

      var queue = [];

      files.forEach(function(filename) {
        var name = path.dirname(path.relative('test/fixtures/example-site/src/components', filename));
        queue.push(getComponent(name));
      });

      if(er) {
        reject(er)
      } else {
        Promise.all(queue).then(resolve);
      }

    });
  });
}

module.exports = {
  getComponent: getComponent,
  getComponents: getComponents
};
