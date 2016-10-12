var config = require('config');

function initialize(app) {

  app.get('/', function (req, res) {
    res.render('releases-pipeline.html', {
      "config": config.get("client"), helpers: {
        json: function (context) {
          return JSON.stringify(context);
        }
      }
    });
  });
}

exports.initialize = initialize;