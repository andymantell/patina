var path = require('path');
var fs = require('fs');
var components = require('../modules/components');
var mkdirp = require('mkdirp');
var ncp = require('ncp').ncp;

function copy(from, to) {
  console.time('Copy from ' + from + ' to ' + to);
  return new Promise(function(resolve, reject) {

    var stat = fs.statSync(from);

    if(stat.isFile()) {

      mkdirp.sync(path.dirname(to));

      fs.createReadStream(from)
        .pipe(fs.createWriteStream(to))
        .on('finish', function() {
          resolve(to);
          console.timeEnd('Copy from ' + from + ' to ' + to);
        })
        .on('error', function(err) {
          reject(err);
        });
    } else {
      mkdirp.sync(to);

      ncp(from, to, function(err, files) {
        if(err) {
          reject(err);
          return;
        }

        resolve(files);
        console.timeEnd('Copy from ' + from + ' to ' + to);
      });
    }
  });
}

module.exports = {
  'copy': copy
};
