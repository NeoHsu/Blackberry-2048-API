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

module.exports = app;
