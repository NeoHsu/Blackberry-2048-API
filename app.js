/*
 *  Created by Neo Hsu on 2014/11/20.
 *  Copyright (c) 2014 Neo Hsu. All rights reserved.
 */

// Load Modules
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var app = express();
var scoreRouter = require('./routes/score');
var searchRouter = require('./routes/search');
var Config = require('./models/Config');

//connect to our database
var dbName = 'Blackberry2048API';
var connectionString = 'mongodb://localhost:27017/' + dbName;
mongoose.connect(connectionString);

//setting body parser option
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(multer());

var checkAuthorization = function(req, res, next) {
  var result = {
    Success: false,
    Code: -1
  };
  if (req.header("Auth") === Config.Key) {
    next();
  } else {
    result.Success = false;
    result.Code = 403;
    res.json(result);
  }
};

app.use('/API', checkAuthorization, scoreRouter);
app.use('/API', checkAuthorization, searchRouter);

module.exports = app;
