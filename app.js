var express = require('express'),
    app     = express(),
    request = require('request');


var server = app.listen(3000, function() {

    var apiUrl = 'http://api.wunderground.com/api/d45432e79a514535/geolookup/conditions/lang:EN/q/CA/San_Francisco.json';

     // set templating engine and jade
     app.set('views', './views');
     app.set('view engine', 'jade');
     app.engine('jade', require('jade').__express);

    // register default route
    app.get('/', function (req, res) {

        // make hardcoded basic api call to lookup sfo's weather
        request(apiUrl, function (err, response, body) {

          var json = {},
              data = {};

        if (!err && response.statusCode == 200) {

            json = JSON.parse(body);

            // TODO : do defensive checks
            data = {
                'city'  : json.location.city,
                'state' : json.location.state,
                'temp'  : json.current_observation.temperature_string
            };

            res.render('weather', data);
          }
        });
    });
});