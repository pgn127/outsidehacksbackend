const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//
// var models = require('../models.js');
// var User = models.User;
// var Photo = models.Photo;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Imports the Google Cloud client library
// const projectId = 'outside-hakcs';
const Vision = require('@google-cloud/vision');
// ({
//   keyFilename: './outside_vision_credentials.json',
//   projectId: 'outside-hakcs',
// });


// var gcloud = require('gcloud')({
//   keyFilename: './outside_vision_credentials.json',
//   projectId: 'outside-hakcs',
// })
// var Vision = gcloud.vision();

let nowUser = {};

var isActuallyFood = function (keywords, labels) {
    return labels.some(function (v) {
        return keywords.indexOf(v) >= 0;
    });
};



// The name of the image file to annotate
// const fileName = '../resources/mouse.jpg';

// YOUR API ROUTES HERE
// router.get('/user', function(req, res) {
//   User.findOne({username: "Ryan"}, function(err, user){
//     if(err) {console.log(err)}
//     else{
//       res.send({success: true, user: user})
//     }
//   }) //search for username
//   // res.send({text: "this is get user"})
// })

// router.get('/user/inbox', function(req, res) {
//   console.log("entering user/inbox");
//   User.findOne({username: req.body.username}, function(err, user){
//     if(err) {res.send({err})}
//     else{
//       console.log("this is user.receivedPhotos", user.receivedPhotos);
//       res.send({success: true, userInbox: user.receivedPhotos})
//     }
//   }) //search for username
// })


// router.post('/login', function(req, res) {
//   User.findOne({username: req.body.username}, function(err, user){
//     if(err) {res.send({err})}
//     else{
//       console.log("User in backend", user);
//       nowUser = user;
//       console.log("this is nowUser", nowUser);
//       res.send({success: true, user: user});
//     }
//   }) //search for username
//   // res.send({text: "this is get user"})
// })

//
// router.post('/user', function(req, res) {
//   var newUser = new User({
//     username: req.body.username,
//     password: req.body.password,
//     friendList: [],
//     sentPhotos: [],
//     receivedPhotos: []
//   })
//   newUser.save(function(err){
//     if(err){console.log(err)}
//   })
//   res.send({success: true})
// })
router.post('/vision', function(req, res) {
  console.log("Hit /vision route");

  // Your Google Cloud Platform project ID
  // const projectId = 'snackchat-d4ab1';
  const projectId = 'outside-hakcs';
  // Instantiates a client
  const visionClient = Vision({
    projectId: projectId,
    credentials: [],
    //credentials: './outside_vision_credentials.json',
  });

  console.log("This is Vision Client: ", visionClient);


  // console.log("this is username: ", username);
  // const fileName = '../resources/mouse.jpg';

  // Performs label detection on the image file
  visionClient.detectSimilar('./2chains.jpg')
  .then((results) => {
    // console.log("Inside visionClient results");
    // const labels = results[0];
    // const validFoodArr = ["Food", "Drink", "Snack", 'Vegetable', "Produce", "Pizza", "Drink", "Cuisine", "Grapes"]
    // const isFood = isActuallyFood(validFoodArr, results[0])
    res.json({success:true, results: results[1].responses[0].webDetection })
    console.log(results[1].responses[0].webDetection);


  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
})


router.post('/photo', function(req, res){

  // var newPhoto = new Photo({
  //   from: req.body.from,
  //   to: req.body.to,
  //   timestamp: Date.now(),
  //   labels: req.body.labels,
  //   imgFile: req.body.link
  // })

  // User.findOne({username: "Ryan"}, function(err, user){
  //   if(err){console.log(err)}
  //   else{
  //     user.receivedPhotos.push(newPhoto);
  //     user.save(function(err){
  //       if(err){console.log(err)}
  //       else{console.log("photo saved")}
  //       res.send({text: "picture saved into Ryan's received photos"})
  //     })
  //   }
  // })
})

// router.post('/addfriend', function(req, res){
//   // User.findOne({username: "rcsmooth"})
//   // .then(user1, function(err) {
//   //   User.findOne({username: req.body.username})
//   //   .then(user2, function(err) {
//   //
//   //   })
//   // })
//   //
//   // {
//   //   )
//   // }
//   // .then(user1, function(user2){
//   //   user1.friendsList.push(user2.username);
//   //
//   //   user1.save(function(err){
//   //     if(err){console.log(err)}
//   //     else{res.send({text: 'friend saved in user!'})}
//   //   })
//   // })
//   res.send({text: "this feature is not implemented yet lolz"})
// })

// router.post('/send', function(req, res){
//   console.log("entering /send route, this is req: ", req);
//   User.findOne({username: req.body.username}, function(err, user){
//     if(err){console.log(err)}
//     else{
//       user.receivedPhotos.push(req.body.photo);
//       console.log("this photo was just pushed to receivedPhoto array: ", req.body.photo);
//     }
//   })
// })

router.get('/test', function(req,res){
  res.status(200).json({success: true})
})


router.post('/vision', function(req, res) {
  console.log("Hit /vision route");
  // Your Google Cloud Platform project ID
  //const projectId = 'snackchat-d4ab1';
  // Instantiates a client
  var types = [
  'faces',
  'landmarks',
  'labels',
  'logos',
  'properties',
  'safeSearch',
  'text',
  ];


  //console.log("This is Vision Client: ", visionClient);

  //var link = req.body.link;
  //console.log(req.body.username);
  Vision.detect('./2chains.jpg',types, function(err, detections, apiResponse) {
    res.json({success:true, results:detections, response: apiResponse})
  });
  // console.log("this is username: ", username);
  // const fileName = '../resources/mouse.jpg';

  // Performs label detection on the image file

})

module.exports = router;
