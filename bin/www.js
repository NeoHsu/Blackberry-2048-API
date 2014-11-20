/*
 *  Created by Neo Hsu on 2014/11/20.
 *  Copyright (c) 2014 Neo Hsu. All rights reserved.
 */

var app = require('../app');

app.set('port', process.env.PORT || 55688);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
