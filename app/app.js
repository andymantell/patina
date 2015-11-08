var express = require('express');
var app = express();
var handlebars = require('handlebars');
var glob = require("glob");
var path = require('path');
var fs = require('fs');
var yfm = require('yfm');

var hbs = handlebars.create();

var components = [];
var pages = [];

// Register components
glob("test/fixtures/example-site/src/components/**/component.yaml", function (er, files) {
  files.forEach(function(filename) {
    var name = path.dirname(path.relative('test/fixtures/example-site/src/components', filename));

    hbs.registerPartial(name, fs.readFileSync(path.join(path.dirname(filename), 'template.hbs'), 'utf8'));

    // Register component demo variants
    glob(path.join(path.dirname(filename), 'demos/*.hbs'), function(er, files) {
      files.forEach(function(demoFilename) {
        components.push({
          name: name + ': ' + path.basename(demoFilename, path.extname(demoFilename)), // @TODO: Pull name from component.yaml
          href: '/components/' + name + '/' + path.basename(demoFilename, path.extname(demoFilename))
        });

        // hbs.registerPartial('demos/' + name + '/' + path.basename(demoFilename, path.extname(demoFilename)), fs.readFileSync(demoFilename, 'utf8'));
      });
    });
  });
});

// Register pages
glob("test/fixtures/example-site/src/pages/**/component.yaml", function (er, files) {
  files.forEach(function(filename) {
    var name = 'page/' + path.dirname(path.relative('test/fixtures/example-site/src/pages', filename));

    pages.push({
      name: name, // @TODO: Pull name from component.yaml
      href: '/' + name
    });

    hbs.registerPartial(name, fs.readFileSync(path.join(path.dirname(filename), 'template.hbs'), 'utf8'));
  });
});

// Register layouts
glob("test/fixtures/example-site/src/layouts/**/*.hbs", function (er, files) {
  files.forEach(function(filename) {
    hbs.registerPartial('layout/' + path.basename(filename, path.extname(filename)), fs.readFileSync(filename, 'utf8'));
  });
});

app.get('/', function(req, res) {
  res.send(hbs.compile(hbs.partials['layout/index'])({
    components: components,
    pages: pages
  }));
});

app.get('/components/:component/:variant', function(req, res){

  var page = fs.readFileSync(path.join('test/fixtures/example-site/src/components', req.params.component,  'demos', req.params.variant + '.hbs'), 'utf8');
  var pageData = yfm(page);

  res.send(hbs.compile(hbs.partials['layout/main'])({
    body: hbs.compile(pageData.content)(pageData.context)
  }));
});

app.get('/page/:page', function(req, res){
  res.send(hbs.compile(hbs.partials['layout/main'])({
    body: hbs.compile(hbs.partials[req.params.page])
  }));
});

app.listen(3000);

// Export our server for testing purposes
module.exports = app;
