
var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyA5_k8dod5CDp952PVDJn2gGv48uKHqLzs",
    authDomain: "project-4003291579197411386.firebaseapp.com",
    databaseURL: "https://project-4003291579197411386.firebaseio.com",
    storageBucket: "project-4003291579197411386.appspot.com",
};
firebase.initializeApp(config);

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.ask = function(req, res) {
  res.render('ask');
}

exports.paid = function(req, res) {
  res.render('paid');
}

exports.free = function(req, res) {
  res.render('free');
}

exports.profile = function(req, res) {
  res.render('profile');
}

exports.update = function(req, res) {
  res.render('update');
}

exports.all = function(req, res) {
  res.redirect('/');
}

exports.add_user_to_free = function(req, res) {
    var email = req.body.email;
    if (email != undefined) {
        var postData = {
             email : email
        };
        // Get a key for a new Post.
        var newPostKey = firebase.database().ref().child('users-free').push().key;
        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/users-free/' + newPostKey] = postData;
        var response = firebase.database().ref().update(updates);
        console.log(response);
        res.render('index', { message : true});
    }
}

exports.add_user_to_paid = function(req, res) {
    var email = req.body.email;
    if (email != undefined) {
        var postData = {
             email : email
        };
        // Get a key for a new Post.
        var newPostKey = firebase.database().ref().child('users-paid').push().key;
        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/users-paid/' + newPostKey] = postData;
        var response = firebase.database().ref().update(updates);
        console.log(response);
        res.render('paid', { message : true});
    }
}