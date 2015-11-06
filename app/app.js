var express = require('express');
var app = express();
var handlebars = require('handlebars');
var glob = require("glob");
var path = require('path');
var fs = require('fs');

var hbs = handlebars.create();

// Register components
glob("test/fixtures/example-site/src/components/**/component.yaml", function (er, files) {
  files.forEach(function(filename) {
    var name = path.dirname(path.relative('test/fixtures/example-site/src/components', filename));
    hbs.registerPartial(name, fs.readFileSync(path.join(path.dirname(filename), 'template.hbs'), 'utf8'));
  });
});

// Register layouts
glob("test/fixtures/example-site/src/layouts/**/*.hbs", function (er, files) {
  files.forEach(function(filename) {
    hbs.registerPartial('layout-' + path.basename(filename, path.extname(filename)), fs.readFileSync(filename, 'utf8'));
  });
});

app.get('/', function(req, res) {
  res.redirect('/components/page-index');
});

app.get('/components/:component', function(req, res){
  res.send(hbs.compile(hbs.partials['layout-main'])({
    body: handlebars.compile(hbs.partials[req.params.component])
  }));
});

app.listen(3000);

// Export our server for testing purposes
module.exports = app;
