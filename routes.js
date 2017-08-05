const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const Vision = require('@google-cloud/vision');
// const multer = require('multer')
// let upload = multer()
var uuid = require('node-uuid');
var fs = require('fs-extra');
var path = require('path');
//
const aws = require('aws-sdk');
  const multer = require('multer');
  const multerS3 = require('multer-s3');


  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-west-2",
  });
  const upload = multer({
    storage: multerS3({
      s3,
      bucket: 'outsidecelebs',
      acl: 'public-read',
      metadata: function (req, file, cb) {
  cb(null, {fieldName: file.fieldname});
},
      key(req, file, cb) {
          cb(null, file.originalname);// cb(null, file);// + '.png'
      }
    })
  });


  var rekognition = new aws.Rekognition({apiVersion: '2016-06-27',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2'});


router.post('/api/recognizeCelebs', upload.single('photo'), function(req,res, next) {
    // const imagePath = req.file.location;
    // var bitmap = fs.readFileSync(imagePath);
    // console.log('req.file', req.file);
    console.log('entered recogognize celebs');
    var params = {
        Image: {
            // Bytes: bitmap//new Buffer('...') || 'STRING_VALUE',
            S3Object: {
                Bucket: 'outsidecelebs',
                Name: req.file.originalname
            }
        }
    };


    rekognition.recognizeCelebrities(params, function(err, data) {
        if (err) {
            // console.log('errorrrr', err, err.stack);
            res.status(400).json({error: err})
        } // an error occurred
        else  {
            console.log('resulting data', data);
            // celebrityFaces: data.CelebrityFaces, unrecognizedFaces: data.UnrecognizedFaces})
            res.status(200).json(data)
        }             // successful response
    });
})




// const compareUpload = multer({
//   storage: multerS3({
//     s3,
//     bucket: 'outsidecelebs',
//     acl: 'public-read',
//     metadata: function (req, file, cb) {
// cb(null, {fieldName: file.fieldname});
// },
//     key(req, file, cb) {
//         cb(null, file.originalname);// cb(null, file);// + '.png'
//     }
//   })
// });



router.post('/api/matchSteve', upload.single('photo'), function(req,res, next) {
    // const imagePath = req.file.location;
    // var bitmap = fs.readFileSync(imagePath);
    // console.log('req.file', req.file);

    var params = {
        CollectionId: 'facematching',
        FaceMatchThreshold: 90,
        Image: {
            // Bytes: bitmap//new Buffer('...') || 'STRING_VALUE',
            S3Object: {
                Bucket: 'outsidecelebs',
                Name: req.file.originalname
            }
        },
        MaxFaces: 1
    };


    rekognition.searchFacesByImage(params, function(err, data) {
	 	if (err) {
            res.status(400).json({error: err})
            // (err);
	 	} else {
			if(data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face)
			{
                console.log('it matches ');
				res.status(200).json({success: true, match: data.FaceMatches[0].Face});
			} else {
				res.status(200).json({success: false, error: 'Sorry, thats not Steve!'});
			}
		}
	});
})



const uploadMatch = multer({
  storage: multerS3({
    s3,
    bucket: 'outsidehackers',
    acl: 'public-read',
    metadata: function (req, file, cb) {
cb(null, {fieldName: file.fieldname});
},
    key(req, file, cb) {
        cb(null, file.originalname);// cb(null, file);// + '.png'
    }
  })
});
router.post('/vision/matchImage', upload.single('photo'), (req, res, next) => {
   // console.log('AT UPLOAD');
   // console.log(req);

   const imagePath = req.file.location;
   console.log('req.file.location ', imagePath);
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
   visionClient.detectSimilar(imagePath)
   .then((results) => {
       const webDetection = results[1].responses[0].webDetection;

       if (webDetection.webEntities.length) {
        //  console.log(`Web entities found: ${webDetection.webEntities.length}`);
         const resultObject = webDetection.webEntities[0];
         console.log('alll web entities', webDetection.webEntities);
         res.status(200).json({success:true, result: resultObject})
     } else {
         console.log('coudlnt find mathcing images');
         throw new Error('Could not find matching images')
     }

   })
   .catch((err) => {
       console.log('error ', err);
       res.status(400).json({error:err})
   });
   // res.status(200).json({result: req.file.location})
 })

 var ACRCloud = require( 'acr-cloud' );
 // var acr = new ACRCloud({
 //  access_key: '5d4b56f25644448cd602a1185faf2c01',//process.env.ACR_ACCESS_KEY,
 //  access_secret: '1p93ZB8zfMVX337dm8aexsnhQnmvbPxC98uzyklj'//process.env.ACR_ACCESS_SECRET
 // });
 var url = require('url');
 var fs = require('fs');
 var crypto = require('crypto');
 var request = require('request');
 var defaultOptions = {
   host: 'identify-us-west-2.acrcloud.com',
   endpoint: '/v1/identify',
   signature_version: '1',
   data_type:'audio',
   secure: true,
   access_key: '5d4b56f25644448cd602a1185faf2c01',
   access_secret: '1p93ZB8zfMVX337dm8aexsnhQnmvbPxC98uzyklj'
 };
 function buildStringToSign(method, uri, accessKey, dataType, signatureVersion, timestamp) {
   return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
 }
 function sign(signString, accessSecret) {
   return crypto.createHmac('sha1', accessSecret)
     .update(new Buffer(signString, 'utf-8'))
     .digest().toString('base64');
 }
 router.use( bodyParser.json() );
 router.use( bodyParser.urlencoded( {extended: true } ) );
 function identify(data, options, cb) {
   var current_data = new Date();
   var timestamp = current_data.getTime()/1000;
   var stringToSign = buildStringToSign('POST',
     options.endpoint,
     options.access_key,
     options.data_type,
     options.signature_version,
     timestamp);
   var signature = sign(stringToSign, options.access_secret);
   var formData = {
     sample: data,
     access_key:options.access_key,
     data_type:options.data_type,
     signature_version:options.signature_version,
     signature:signature,
     sample_bytes:data.length,
     timestamp:timestamp,
   }
   request.post({
     url: "http://"+options.host + options.endpoint,
     method: 'POST',
     formData: formData
   }, cb);
 }
 router.post('/audio', function(req,res){
   // res.json({req:req})
   var buf = Buffer.from(req.body.audio, 'base64');
   identify(buf, defaultOptions, function (err, httpResponse, body) {
     if (err) {

        //  console.log(err);
        res.status(400).json({success:false, error: err})
    } else {
        var info = JSON.parse(body);
        // console.log(info);
        if (info.metadata){
          res.status(200).json({success: true, title: info.metadata.music[0].title})
        }else{
          res.status(200).json({success:false})
        }

        // console.log(info.metadata.music);
        // console.log(info.metadata.music[0].artists);
    }

   });
 })


// Enable cross domain
// router.use( function( req, res, next ) {
// 	res.header( 'Access-Control-Allow-Origin', '*' );
// 	res.header( 'Access-Control-Allow-Headers', 'X-Requested-With' );
// 	next();
// });
// const sizeLimit = '5mb';
// router.use( bodyParser.json( { limit: sizeLimit } ) );
// router.use( bodyParser.urlencoded( { limit: sizeLimit, extended: true } ) );
//
// router.post( '/audio', function( req, res ) {
//     // console.log('audio route req', req.body);
// 	// Return error if the audio parameter was not sent
// 	if( !req.body || !req.body.audio ) {
//         console.log('!req.body');
//         res.status(400).json({
// 			success: false,
// 			msg: "Must have an audio parameter",
// 			data: req.body
// 		});
// 		// return res.send({
// 		// 	success: false,
// 		// 	msg: "Must have an audio parameter",
// 		// 	data: req.body
// 		// });
// 	}
//
// 	// HTML/JS base64 src audio file
// 	// var buffer = req.body.audio.replace(/^data:audio\/wav;base64,/, "");
// 	var buffer = req.body.audio;
// 	acr.identify( buffer )
// 	.then( function( data ) {
// 		var response = JSON.parse( data.body );
// 		if( data.statusCode == 200 && response.status ) {
// 			var success = ( response.status.msg == 'Success' );
// 			// return res.send({
// 			// 	success: success,
// 			// 	msg: response.status.msg,
// 			// 	data: response
// 			// });
//             return res.status(200).json({
// 				success: success,
// 				msg: response.status.msg,
// 				data: response
// 			});
// 		} else {
//             // return res.send({
// 			// 	success: false,
// 			// 	msg: "Error reaching API",
// 			// 	data: data
// 			// });
// 			return res.status(400).json({
// 				success: false,
// 				msg: "Error reaching API",
// 				data: data
// 			});
// 		}
// 		// res.send({
// 		// 	success: true,
// 		// 	msg: "Found the audio",
// 		// 	data: data
// 		// })
//         res.status(200).json({
// 			success: true,
// 			msg: "Found the audio",
// 			data: data
// 		})
// 	})
// 	.catch( function( err ) {
// 		// return res.send({
// 		// 	success: false,
// 		// 	msg: "Error identifying audio",
// 		// 	data: err
// 		// });
//         return res.status(400).json({
// 			success: false,
// 			msg: "Error identifying audio",
// 			data: err
// 		});
// 	})
// });
//
//
module.exports = router;
