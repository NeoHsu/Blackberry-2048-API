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
    }).sort({
      score: -1
    }).exec(function(err, docs) {
      if (err) {
        result.Success = false;
        result.Code = 500;
        result.Message = err.toString();
        res.json(result);
      } else {
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
    var result = {
      Success: false,
      Code: -1
    };
    console.log(req.Score);

    if (req.Score === null) {
      req.OriginalScore.create_datetime = req.OriginalScore.update_datetime = new Date().getTime();
      var mScore = new Score(req.OriginalScore);
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
        res.json(result);
      });
    } else {
      if (typeof(req.OriginalScore.name) !== "undefined" && req.OriginalScore.name !== null && req.OriginalScore.name.length > 0) {
        req.Score.name = req.OriginalScore.name;
      }

      if (typeof(req.OriginalScore.score) !== "undefined" && req.OriginalScore.score !== null && req.OriginalScore.score > req.Score.score) {
        req.Score.score = req.OriginalScore.score;
      }

      if (typeof(req.OriginalScore.pin) !== "undefined" && req.OriginalScore.pin !== null && req.OriginalScore.pin.length > 0) {
        req.Score.pin = req.OriginalScore.pin;
      }

      if (typeof(req.OriginalScore.country) !== "undefined" && req.OriginalScore.country !== null && req.OriginalScore.country.length > 0) {
        req.Score.country = req.OriginalScore.country;
      }

      if (typeof(req.OriginalScore.device) !== "undefined" && req.OriginalScore.device !== null && req.OriginalScore.device.length > 0) {
        req.Score.device = req.OriginalScore.device;
      }

      var update = {
          $set: {
            update_datetime: new Date().getTime(),
            pin: req.Score.pin,
            name: req.Score.name,
            score: req.Score.score,
            country: req.Score.country,
            device: req.Score.device
          }
        },
        conditions = {
          score_id: mongoose.Types.ObjectId(req.Score.score_id)
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
          res.json(result);
        }
      });
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
      bbid: originalScore.bbid,
      delete: false
    }).exec(function(err, doc) {
      if (err) {
        result.Success = false;
        result.Code = 500;
        res.json(result);
      } else {
        if (doc !== null) {
          req.Score = doc.toObject();
        } else {
          req.Score = null;
        }
        next();
      }
    });
  }
}

function doVerificationObject(tmp) {
  if (typeof(tmp.bbid) === "undefined") {
    return null;
  }
  return tmp;
}


module.exports = router;
