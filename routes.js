const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const Vision = require('@google-cloud/vision');
// const multer = require('multer')
// let upload = multer()

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


var ACRCloud = require( 'acr-cloud' );
var acr = new ACRCloud({
	access_key: process.env.ACR_ACCESS_KEY,
	access_secret: process.env.ACR_ACCESS_SECRET
});

// Enable cross domain
router.use( function( req, res, next ) {
	res.header( 'Access-Control-Allow-Origin', '*' );
	res.header( 'Access-Control-Allow-Headers', 'X-Requested-With' );
	next();
});
const sizeLimit = '5mb';
router.use( bodyParser.json( { limit: sizeLimit } ) );
router.use( bodyParser.urlencoded( { limit: sizeLimit, extended: true } ) );

router.post( '/audio', function( req, res ) {
    console.log('audio route req', req.body);
	// Return error if the audio parameter was not sent
	if( !req.body || !req.body.audio ) {
        console.log('!req.body');
		return req.send({
			success: false,
			msg: "Must have an audio parameter",
			data: req.body
		});
	}

	// HTML/JS base64 src audio file
	// var buffer = req.body.audio.replace(/^data:audio\/wav;base64,/, "");
	var buffer = req.body.audio;
	acr.identify( buffer )
	.then( function( data ) {
		var response = JSON.parse( data.body );
		if( data.statusCode == 200 && response.status ) {
			var success = ( response.status.msg == 'Success' );
			return res.send({
				success: success,
				msg: response.status.msg,
				data: response
			});
            // return res.status(200).json({
			// 	success: success,
			// 	msg: response.status.msg,
			// 	data: response
			// });
		} else {
            return res.send({
				success: false,
				msg: "Error reaching API",
				data: data
			});
			// return res.status(400).json({
			// 	success: false,
			// 	msg: "Error reaching API",
			// 	data: data
			// });
		}
		res.send({
			success: true,
			msg: "Found the audio",
			data: data
		})
        // res.status(200).json({
		// 	success: true,
		// 	msg: "Found the audio",
		// 	data: data
		// })
	})
	.catch( function( err ) {
		return res.send({
			success: false,
			msg: "Error identifying audio",
			data: err
		});
        // return res.status(400).json({
		// 	success: false,
		// 	msg: "Error identifying audio",
		// 	data: err
		// });
	})
});
//
//
module.exports = router;
