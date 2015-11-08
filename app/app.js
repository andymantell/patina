var express = require('express');
var app = express();
var handlebars = require('handlebars');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var yfm = require('yfm');
var yaml = require('js-yaml');

var hbs = handlebars.create();

var components = {};
var pages = [];

// Register core handlebars helpers (I.e. those that are not part of a component)
glob('app/handlebars/helpers/**/*.js', function(er, files) {
  files.forEach(function(filename) {
    var helper = require(path.resolve(process.cwd(), filename));
    hbs.registerHelper(path.basename(filename, path.extname(filename)), helper(hbs));
  });
});

// Register components
glob('test/fixtures/example-site/src/components/**/component.yaml', function (er, files) {
  files.forEach(function(filename) {
    var name = path.dirname(path.relative('test/fixtures/example-site/src/components', filename));

    hbs.registerPartial(name, fs.readFileSync(path.join(path.dirname(filename), 'template.hbs'), 'utf8'));

    components[name] = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));

    var readmePath = path.join(path.dirname(filename), 'README.md');
    if(fs.existsSync(readmePath)) {
      components[name].readme = fs.readFileSync(readmePath, 'utf8');
    }

    components[name].variants = [];

    // Register component demo variants
    glob(path.join(path.dirname(filename), 'demos/*.hbs'), function(er, files) {
      files.forEach(function(demoFilename) {

        var variantHTML = fs.readFileSync(demoFilename, 'utf8');
        var variantFrontmatter = yfm(variantHTML).context;

        var variantName = path.basename(demoFilename, path.extname(demoFilename));
        components[name].variants.push({
          name: variantFrontmatter.title ? variantFrontmatter.title : variantName,
          href: '/components/' + name + '/' + variantName
        });
      });
    });
  });
});

// Register pages
glob('test/fixtures/example-site/src/pages/**/component.yaml', function (er, files) {
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
glob('test/fixtures/example-site/src/layouts/**/*.hbs', function (er, files) {
  files.forEach(function(filename) {
    hbs.registerPartial('layout/' + path.basename(filename, path.extname(filename)), fs.readFileSync(filename, 'utf8'));
  });
});

app.get('/', function(req, res) {

  // Sort the components by category
  var sortedComponents = {};
  for(var component in components) {

    var thisComponent = components[component];

    if(components.hasOwnProperty(component)) {

      if(!thisComponent.categories) {
        thisComponent.categories = {
          primary: 'Unsorted',
          secondary: 'Unsorted'
        };
      }

      if(!sortedComponents[thisComponent.categories.primary]) {
        sortedComponents[thisComponent.categories.primary] = {};
      }

      if(!sortedComponents[thisComponent.categories.primary][thisComponent.categories.secondary]) {
        sortedComponents[thisComponent.categories.primary][thisComponent.categories.secondary] = [];
      }

      sortedComponents[thisComponent.categories.primary][thisComponent.categories.secondary].push(thisComponent);
    }
  }

  res.send(hbs.compile(hbs.partials['layout/index'])({
    components: sortedComponents,
    pages: pages
  }));
});

app.get('/components/:component/:variant', function(req, res){

  var page = fs.readFileSync(path.join('test/fixtures/example-site/src/components', req.params.component,  'demos', req.params.variant + '.hbs'), 'utf8');
  var pageData = yfm(page);

  // Pass details of all the components to the
  pageData.context.component = components[req.params.component];

  console.log(pageData.context.component);

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
