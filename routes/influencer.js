var request = require('request');
var BASE_URL = "https://o2uzqo7yv2.execute-api.us-east-1.amazonaws.com/prod/";

exports.index = function(req, res) {
    res.render('influencer');
};

exports.access = function(req, res){

    var data = req.body;

    var options = {
      uri: BASE_URL + "request_creator_access",
      method: 'POST',
      json: data
    };

    request(options, function (error, response, body) {
        console.log(body, data);
        if (body.errorMessage === "You're already a creator") {
          console.log(data.access_token);
          request(BASE_URL + "get_info_web?token=" + data.token, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              res.send(body) // Show the HTML for the Google homepage.
            }  else {
              res.send(error);
            }
          })

        } else {
            res.send(body);
        }

    });

};

exports.update_profile_picture = function(req, res) {
  var data = req.body;

  var options = {
    uri: BASE_URL + "/update_profile_picture",
    method: 'POST',
    json: data
  };

  console.log(options)

  request(options, function (error, response, body) {

      if (error) {
        console.log(error);
      } else {
        console.log(body);
        res.send(body);
      }

  });
}
exports.add_info = function(req, res) {

  var data = req.body;

  var options = {
    uri: BASE_URL + "/add_creator_info",
    method: 'POST',
    json: data
  };

  console.log(options);

  request(options, function (error, response, body) {

      if (error) {
        console.log(error);
      } else {
        console.log(body);
        res.send(body);
      }

  });

};

exports.info = function(req, res) {
  res.render('info');
};