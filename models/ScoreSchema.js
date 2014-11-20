/*
 *  Created by Neo Hsu on 2014/11/20.
 *  Copyright (c) 2014 Neo Hsu. All rights reserved.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scoreSchema = new Schema({
  score_id: {
    type: Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId
  },
  create_datetime: Number,
  update_datetime: Number,
  pin: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    default: ""
  },
  score: {
    type: Number,
    default: 0
  },
  country: {
    type: String,
    default: ""
  },
  device: {
    type: String,
    default: ""
  },
  delete: {
    type: Boolean,
    default: false
  }
});


module.exports = mongoose.model('Score', scoreSchema);
