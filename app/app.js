var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(3000);

// Export our server for testing purposes
module.exports = app;
