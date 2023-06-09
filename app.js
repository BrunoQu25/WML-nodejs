/*jslint node: true*/
/*jslint es6 */
"use strict";

var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var getToken = require('./routes/wml.js');

var app = express();
app.use(bodyParser.json())

app.use('/', getToken);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


const port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

app.listen(port, function () {
    console.log("Server running on port: %d", port);
});
module.exports = app;