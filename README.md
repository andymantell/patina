# patina
Pattern library generator.
[![Build Status](https://travis-ci.org/andymantell/patina.svg)](https://travis-ci.org/andymantell/patina)

**Work in progress**


## TODO:

* Configuration options (Currently hardcoded to only render out the example fixture)
* Refactor core. Currently this represents a proof of concept but needs some serious tidying up.
* Use TravisCI to render out the example site fixture to an Amazon S3 bucket so that people can see a demo
* JavaScript - likely implement via Webpack. SystemJS? Or similar universal module loader.
* SASS
* More tests
* Ability to run Patina via grunt (Anticipating that this will be the primary mode of operation)
* SVG rendering to PNG fallbacks etc, perhaps using grunticon, perhaps something else
* Static export JS/CSS and other assets
* Minifying assets (Including JS, CSS and images)
* Static html export (Optional - the exported assets should be the primary build use case)
* Built in validation for
  * HTML
  * JavaScript (JSHint and JSCS)
* ~~Rendering component documentation~~
* ~~Frontmatter support~~
* ~~Ability to define full pages which are constructed out of the various components~~
