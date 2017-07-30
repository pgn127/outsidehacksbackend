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



//MAKING A POST REQUEST TO MATCH IMAGE
//BODY: description: short description of what the image should be i.e. '2chains' 'subway' 'heinekin poster' etc
router.post('/vision/matchImage', function(req, res) {
  // var descToMatch = req.body.description;

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
          "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCc7ZaM8r6PuVDg\n2cVwnSJvpA++XHJst37SoHow970r/nL0Hvw7oIf2zWEWTGvgK+/7mQLMclalS+iF\nO1YM7kNX2SAk9zHsVSE7zsQ/8+YI8Tm10RCidmuf0OMt53McoUz8uwFbkJvqm/07\ndNNZMJuXO5lNS3I4+ulRpGWrbZjl34k/iZnB+0YeDgVNR4KeC1zSiOJkqOQUn7Ys\nD6wkp+HHjH0gG4q5oJoIbYI4d6Ns4PfCbkklu1/MGoOXRFe5W8CVxI68qYVI3F6U\n6BZUf1nlpC5tMHutW9hJ/yiBcVMvjvqWFBAs4e3BjFFOL7+mhTXvGS5BVF7r+Bty\n3D3XGNf/AgMBAAECggEAG6+1OI/ZPA0zbkAtm+U1PqIg3vJ7g5/KIcoLVNlYiEr/\np/9RfAmiA1KP1vnLrITD9c00l7Jyg/5E+0CROX3N5tFZYPw11B7e2qjrqebThm9c\nwa2tdCRVb6BQfHhRsFLq/MnXfvqf73/u6Q7+/MTdJozuyprNf60Q/gT1pQ2UhLWp\nO5PyRf6qJ6PZL66M7GmaG4UhFd5REDoPm4bGyroTaqs8r42LW2kZv17ECk25+Nx5\n37HfuPTlEheAKIikffUQKpQvzHabyp2i1lEfFjZNM9CWUMNVv10w9AXfXFVML1Mu\n0sERFbDlxAeTV/1tyrIgedErnjpC7xOEj90JNGTKyQKBgQDRey5cIq7+3ber0Mr6\nOy66Qa4e/iFjP6e9SIOE/HwO/UEBjhHY31uiAdSu4WxVRNql5Uq3JwFfqTcnT4WE\nKOxrpDa5Cn1um2R1p65nuAc5eWOYcNiW496czrzd/PzxtrrRiEmPb4BMSNYJ49VM\npIM6y2iZCEEuHGg54qQuC63VeQKBgQC/xs9fAvFdrxs6InUw2rgXdEE6NOoeZOP1\n+bZ02+wOMu16KHpNs2y9pyNC4e0FohCCoroKC3dB3FucfLAXYOMJGRbX1x2i4KuF\nQEDV6hMGFYhOqczRUjVYl2/ICeRjrBkdIfD8mWzvODsxAfzjXkqTd7Ll5O64vDOB\n+WU86ygTNwKBgQC19Qd55G6Y10HZLk2BObMG+lIifZ/Gs94h3kDPXPjtlDHJBfye\norTXbjuthAUzs9EwVJCnsmvRCgzsSnixKVLi1QrrhB8b2kJSqEonsYQk+jn2id64\ngko1bqZDNKMJ2i1AH9+1haatnH6+rHX0UtniUhkTBEaJpQcrcKAnluFyEQKBgQCm\n2Rdt+Cd6dHBhwbznxkLH1RMyyvqteuWCCcGeJgBX0iMeVr0hgOsojZN2Cw2mCvwG\nTAFD3/nfyRHDMhAaJucf8T4Yh0V3gbR4eBBwi/gFIRK4La7OppFXBFnyVfjoZsBq\nwi7h9bH65pdI6gvU3SJQ7qEstmKjQsolWI+l0onJPQKBgH6lBS+N/lYNAGjadRX4\n/ej3MGkqUygHKlfu5kl8w0mC/yAeq7TjjweYssjAslan5KyhmuFfULB2cJhaqbEG\n/7M+42ZlK90srJjgkjgYE0eLMo5GD287t/rhp9B+2xfDzmdKVLC3SLNyQEoo7Foi\nq1CIk0+6INGsiy7kpM3sqlaW\n-----END PRIVATE KEY-----\n",
          "client_email": "frankieflores@outside-hakcs.iam.gserviceaccount.com",
          "client_id": process.env.CLIENT_ID,
          "auth_uri": "https://accounts.google.com/o/oauth2/auth",
          "token_uri": "https://accounts.google.com/o/oauth2/token",
          "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
          "client_x509_cert_url": process.env.CLIENT_CERT_URL,
        }
    //credentials: './outside_vision_credentials.json',
  });
  visionClient.detectSimilar('./2chains.jpg')
  .then((results) => {
      const webDetection = results[1].responses[0].webDetection;

      if (webDetection.webEntities.length) {
        console.log(`Web entities found: ${webDetection.webEntities.length}`);
        const resultObject = webDetection.webEntities[0];
        res.json({success:true, result: resultObject})
    } else {
        throw new Error('Could not find matching images')
    }

  })
  .catch((err) => {
      res.json({error:err})
  });
})


module.exports = router;
