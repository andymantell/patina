require('promise-helpers');
var fs = require('fs');
// var path = require('path';)
var extend = require('extend');
var express = require('express');
var app = express();
var components = require('./modules/components');
var pages = require('./modules/pages');
var handlebars = require('./modules/handlebars');

app.get('/', function(req, res) {

  Promise
    .all([
      handlebars(),
      components.getComponents(),
      pages.getPages()
    ])
    .spread(function(hbs, unsortedComponents, demoPages) {

      // Sort the components by category
      var sortedComponents = {};
      unsortedComponents.forEach(function(component) {


        if(!component.categories) {
          component.categories = {
            primary: 'Unsorted',
            secondary: 'Unsorted'
          };
        }

        if(!sortedComponents[component.categories.primary]) {
          sortedComponents[component.categories.primary] = {};
        }

        if(!sortedComponents[component.categories.primary][component.categories.secondary]) {
          sortedComponents[component.categories.primary][component.categories.secondary] = [];
        }

        sortedComponents[component.categories.primary][component.categories.secondary].push(component);
      });

      res.send(hbs.compile(hbs.partials['layout/index'])({
        components: sortedComponents,
        pages: demoPages
      }));
    })
    .catch(function(er) {
      console.log(er);
    });
});

app.get('/components/:component/:variant', function(req, res){

  Promise
    .all([
      handlebars(),
      components.getComponent(req.params.component)
    ])
    .spread(function(hbs, component) {
      var variant = component.variants[req.params.variant];
      var context = extend(variant.context, {component: component });

      res.send(hbs.compile(hbs.partials['layout/main'])({
        body: hbs.compile(variant.content)(variant.context)
      }));

    })
    .catch(function(er) {
      console.log(er);
    });
});

app.get('/page/:page', function(req, res){
  Promise
    .all([
      handlebars(),
      pages.getPages()
    ])
    .spread(function(hbs, demoPages) {

      var page = demoPages[req.params.page];

      res.send(hbs.compile(hbs.partials['layout/main'])({
        body: hbs.compile(page.content)(page.context)
      }));
    })
    .catch(function(er) {
      console.log(er);
    });
});

app.listen(3000);

// Export our server for testing purposes
module.exports = app;
