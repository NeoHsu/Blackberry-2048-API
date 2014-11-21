/*
 *  Created by Neo Hsu on 2014/11/20.
 *  Copyright (c) 2014 Neo Hsu. All rights reserved.
 */

var express = require('express');
var mongoose = require('mongoose');
var Config = require('../models/Config');

var Score = require('../models/ScoreSchema');

var router = express.Router();

// + 新增成績
//   [POST] /Score
router.route('/Score')
  .get(function(req, res) {
    console.log("[GET] /Score");
    var result = {
      Success: false,
      Code: -1
    };
    Score.find({
      delete: false
    }).exec(function(err, docs) {
      if (err) {
        result.Success = false;
        result.Code = 500;
        result.Message = err.toString();
        res.json(result);
      } else {
        if (docs.length > 1) {
          docs.sort(function(a, b) {
            if (a.score > b.score)
              return -1;
            if (a.score < b.score)
              return 1;
            return 0;
          });
        }

        if (typeof(req.query.ID) !== "undefined") {
          docs = docs.filter(function(element) {
            return (element.score_id < mongoose.Types.ObjectId(req.query.ID));
          }).slice(0, req.query.Limit);
        } else {
          docs = docs.slice(0, req.query.Limit);
        }

        result.Success = true;
        result.Code = 200;
        result.Message = docs;
        res.json(result);
      }
    });
  })
  .post(checkScore, function(req, res) {
    console.log("[POST] /Score");
    var tmp = {};
    var result = {
      Success: false,
      Code: -1
    };

    if (req.Score === null) {
      tmp = req.OriginalScore;
      tmp.create_datetime = tmp.update_datetime = new Date().getTime();
      var mScore = new Score(tmp);
      mScore.save(function(err, doc) {
        var result = {
          Success: false,
          Code: -1
        };
        if (err) {
          result.Success = false;
          result.Code = 500;
          result.Message = err.toString();
          res.json(result);
        }
        result.Success = true;
        result.Code = 200;
        // result.Message = doc;
        res.json(result);
      });
    } else {
      tmp = req.Score;
      var db_score = req.Score.score;
      tmp.name = req.OriginalScore.name;
      tmp.score = req.OriginalScore.score;
      if (req.OriginalScore.country.length !== 0) {
        tmp.country = req.OriginalScore.country;
      }
      if (req.OriginalScore.device.length !== 0) {
        tmp.device = req.OriginalScore.device;
      }
      if (tmp.score > db_score) {
        var update = {
            $set: {
              name: tmp.name,
              score: tmp.score,
              country: tmp.country,
              device: tmp.device,
              update_datetime: new Date().getTime()
            }
          },
          conditions = {
            score_id: mongoose.Types.ObjectId(tmp.score_id)
          },
          options = {
            upsert: true
          };
        Score.update(conditions, update, options, function(err, doc) {
          // 檢查是否錯誤
          if (err) {
            result.Success = false;
            result.Code = 500;
            result.Message = err.toString();
            res.json(result);
          } else {
            result.Success = true;
            result.Code = 200;
            // result.Message = tmp;
            res.json(result);
          }
        });
      } else {
        result.Success = true;
        result.Code = 200;
        res.json(result);
      }
    }
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
