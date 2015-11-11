# patina
Pattern library generator.
[![Build Status](https://travis-ci.org/andymantell/patina.svg)](https://travis-ci.org/andymantell/patina)

**Work in progress**


## TODO:

### MVP:

* JavaScript - likely implement via Webpack. SystemJS? Or similar universal module loader.
* Configuration options (Currently hardcoded to only render out the example fixture)
* Ability to run Patina via grunt (Anticipating that this will be the primary mode of operation)
* Minifying assets (Including JS, CSS and images)
* Get html &lt;head&gt; out into a partial

### Nice to haves

* Sort out general confusion between name and title in app.js
* Built in validation for
  * HTML
  * JavaScript (JSHint and JSCS)
* Use TravisCI to render out the example site fixture to an Amazon S3 bucket so that people can see a demo
* SVG rendering to PNG fallbacks etc, perhaps using grunticon, perhaps something else
