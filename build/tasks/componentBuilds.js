var fs = require('fs');
var path = require('path');
var components = require('../modules/components');

var componentBuilds = function(config) {
  var componentBuildOperations = [];

  return components.getComponentsTree(config)
    .then(function(results) {
      return components.populateTree(results, config);
    })
    .then(function(componentsTree) {

      componentsTree.forEach(function(component) {
        if (fs.existsSync(path.join(component.path, 'build.js'))) {
          componentBuildOperations.push(require(path.join(component.path, 'build.js'))(config));
        }
      });

      return Promise.all(componentBuildOperations);
    });
}

module.exports = componentBuilds;
