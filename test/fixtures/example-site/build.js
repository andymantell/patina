// Artificially require Patina from the root. This would be require('patina') normally
var patina = require('../../../index');
var path = require('path');

patina.build({
  src: path.join(__dirname, 'src'),
  destination: path.join(__dirname, 'dist')
})
  .then(function(destination) {
    console.log('Assets built to', destination);
  })
  .catch(function(err) {
    console.error(err);
  });
