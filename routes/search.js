/*
 *  Created by Neo Hsu on 2014/11/20.
 *  Copyright (c) 2014 Neo Hsu. All rights reserved.
 */

var express = require('express');
var mongoose = require('mongoose');
var Config = require('../models/Config');

var Score = require('../models/ScoreSchema');

var router = express.Router();

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) {
        return i;
      }
    }
    return -1;
  }
  // + 新增成績
  //   [GET] /Search
router.route('/Search/:bbid')
  .get(function(req, res) {
    console.log("[GET] /Search/" + req.params.bbid);
    var result = {
      Success: false,
      Code: -1
    };
    Score.find({
      delete: false
    }).sort({
      score: -1
    }).exec(function(err, docs) {
      if (err) {
        result.Success = false;
        result.Code = 500;
        result.Message = err.toString();
        res.json(result);
      } else {
        var index = arrayObjectIndexOf(docs, req.params.bbid.toString(), "bbid");
        var tmp = {};
        if (index >= 0) {
          tmp.score_id = docs[index].score_id;
          tmp.bbid = docs[index].bbid;
          tmp.pin  = docs[index].pin;
          tmp.rank = index + 1;
          tmp.score = docs[index].score;
          tmp.name = docs[index].name;
          tmp.device = docs[index].device;
          tmp.country = docs[index].country;

          result.Success = true;
          result.Code = 200;
          result.Message = tmp;
          res.json(result);
        }else{
          result.Success = false;
          result.Code = 200;
          result.Message = tmp;
          res.json(result);
        }


      }
    });
  });

function checkScore(req, res, next) {
  var result = {
    Success: false,
    Code: -1
  };
  var originalScore = doVerificationObject(req.body);
  if (originalScore === null) {
    result.Success = false;
    result.Code = 400;
    res.json(result);
  } else {
    req.OriginalScore = originalScore;
    Score.findOne({
      pin: originalScore.pin,
      delete: false
    }).exec(function(err, doc) {
      if (err) {
        result.Success = false;
        result.Code = 500;
        // result.Message = err.toString();
        res.json(result);
      } else {
        req.Score = doc;
        next();
      }
    });
  }
}

function doVerificationObject(tmp) {
  if (typeof(tmp.pin) === "undefined") {
    return null;
  }
  if (typeof(tmp.name) === "undefined") {
    return null;
  }
  if (typeof(tmp.score) === "undefined") {
    return null;
  }
  if (typeof(tmp.country) === "undefined") {
    tmp.country = "";
  }
  if (typeof(tmp.device) === "undefined") {
    tmp.device = "";
  }
  return tmp;
}


module.exports = router;
