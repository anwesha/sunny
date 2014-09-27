var express = require('express'),
    app     = express(),
    request = require('request'),
    async   = require("async"),
    dust    = require('dustjs-linkedin'),
    cons    = require('consolidate');

    app.engine('dust', cons.dust);;

function createUrl( state , city) {
    var weatherUrl = 'http://api.wunderground.com/api/d45432e79a514535/geolookup/conditions/lang:EN/q/'+state+'/'+city+'.json';
    return weatherUrl;
}

var server = app.listen(3000, function() {

     // set templating engine
    app.set('views', __dirname + '/views');
    app.set('view engine','dust');
    app.engine('dust', cons.dust);

    // register default route
    app.get('/', function (req, res) {

        var tasks,
            weatherPoints = {
            "CA" : "Campbell",
            "NE" : "Omaha",
            "TX" : "Austin",
            "MD" : "Timonium"
        };

        var getWeatherData = function (state, doneCallback) {
            var apiUrl = createUrl(state, weatherPoints[state]);

            request(apiUrl, function (err, response, body) {
                var json = {};
                var obj = {};
                if (!err && response.statusCode == 200) {

                      json = JSON.parse(body);

                      // TODO : do defensive checks
                      obj = {
                        'city'  : json.location.city,
                        'state' : json.location.state,
                        'temp'  : json.current_observation.temperature_string
                      };

                      doneCallback(null, obj);
                }
            });
        };

        tasks = {
            "CA" : function (callback) {
                getWeatherData("CA", callback);
            },
            "NE" : function (callback) {
                getWeatherData("NE", callback);
            },
            "TX" : function (callback) {
                getWeatherData("TX", callback);
            },
            "MD" : function (callback) {
                getWeatherData("MD", callback);
            }
        }

        async.series(tasks, function (err, response) {

            var data = {};
                weatherData = [];
            weatherData.push(response.CA);
            weatherData.push(response.NE);
            weatherData.push(response.TX);
            weatherData.push(response.MD);

            data.weatherData = weatherData;
            res.render('weather', data);
        });
   });
});
