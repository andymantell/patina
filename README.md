# patina
Pattern library generator.
[![Build Status](https://travis-ci.org/andymantell/patina.svg)](https://travis-ci.org/andymantell/patina)

**Work in progress**


## TODO:

* Sort out general confusion between name and title in app.js
* Configuration options (Currently hardcoded to only render out the example fixture)
* Use TravisCI to render out the example site fixture to an Amazon S3 bucket so that people can see a demo
* JavaScript - likely implement via Webpack. SystemJS? Or similar universal module loader.
* SASS (Automatic creation of the main sass imports using dependencies between components)
* Ability to run Patina via grunt (Anticipating that this will be the primary mode of operation)
* SVG rendering to PNG fallbacks etc, perhaps using grunticon, perhaps something else
* Static export JS/CSS and other assets
* Minifying assets (Including JS, CSS and images)
* Built in validation for
  * HTML
  * JavaScript (JSHint and JSCS)
