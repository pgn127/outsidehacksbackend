const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
// Imports the Google Cloud client library
// const projectId = 'outside-hakcs';
const Vision = require('@google-cloud/vision');
const baseURL = 'https://outside-hacks.herokuapp.com/'
let nowUser = {};
var isActuallyFood = function (keywords, labels) {
    return labels.some(function (v) {
        return keywords.indexOf(v) >= 0;
    });
};

router.post('/vision/matchImage', function(req, res) {
  console.log("Hit /vision route");
  // Your Google Cloud Platform project ID
  // const projectId = 'snackchat-d4ab1';
  const projectId = 'outside-hakcs';
  // Instantiates a client
  const visionClient = Vision({
    projectId: projectId,
    credentials: {
      "type": "service_account",
      "project_id": "outside-hakcs",
      "private_key_id": process.env.PRIVATE_KEY_ID,
      "private_key": process.env.PRIVATE_KEY,
      "client_email": "frankieflores@outside-hakcs.iam.gserviceaccount.com",
      "client_id": process.env.CLIENT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": process.env.CLIENT_CERT_URL
    }
    //credentials: './outside_vision_credentials.json',
  });
  console.log("This is Vision Client: ", visionClient);
  // console.log("this is username: ", username);
  // const fileName = '../resources/mouse.jpg';
  // Performs label detection on the image file
  visionClient.detectSimilar('./2chains.jpg')
  .then((results) => {
    res.json({success:true, results: results[1].responses[0].webDetection })
    console.log(results[1].responses[0].webDetection);
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
})


module.exports = router;
