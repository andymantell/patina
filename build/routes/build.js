var tgz = require('express-tgz');
var build = require('../build');

module.exports = function(app){

  /**
   * Download a tarball of the built out assets
   */
  app.get('/build', function(req, res){
    if(!req.query.components) {
      res.send('No components selected');

      return;
    }

    build({
      mode: 'production',
      cache: false,
      components: Object.keys(req.query.components),
      assetPath: req.query.assetPath ? req.query.assetPath : '',
      destination: '.tmp/dist'
    })
      .then(function(directory) {
        res.tgz(directory, 'build.tar.gz', false);
      })
      .catch(function(err) {
        res.send(err.formatted);
        require('trace');
        require('clarify');
        console.trace(err);
      });
  });
}
