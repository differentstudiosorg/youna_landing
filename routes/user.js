var BASE_URL = "https://o2uzqo7yv2.execute-api.us-east-1.amazonaws.com/prod/";
var USER_INFO_URL = BASE_URL + "get_user_info?user_id=";
var S3_URL = BASE_URL + "/get_s3_get_url_web?type=";
var QUESTION = "question";
var ANSWER = "answer";
var FILENAME_PARAM = "&filename=";
var request = require('request');

exports.display = function (req, res) {
    var id = req.params.id;
    request(USER_INFO_URL + id, function(err, response) {
        if (err) return res.redirect('/');
        else {
            var data = JSON.parse(response.body);
            console.log(data);
            res.render('user', {data : data});
        }
    })
};
