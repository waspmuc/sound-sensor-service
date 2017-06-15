'use strict';


const SwaggerExpress = require('swagger-express-mw');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

//  if (swaggerExpress.runner.swagger.paths['/sensor']) {
//    console.log('try this:\ncurl http://127.0.0.1:' + port + '/sensor?name=Scott');
//  }
});
