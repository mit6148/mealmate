//Source: 6.148 Staff

var albumBucketName = process.env.S3_BUCKET_NAME;
var bucketRegion = process.env.S3_BUCKET_REGION;
var IdentityPoolId = process.env.S3_IDENTITY_POOL_ID;

const AWS = require('aws-sdk');
//update the configurations for AWS to use our credentials
AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

//create an S3 instance that we can use to access the databaseph
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});

/*
//get all the data from the bucket and call addAllPhotos to display it
function viewAlbum() {
  s3.listObjects({}, function(err, data){
    if (err){
      return alert('There was an error: ' + err.message);
    }
    var bucketUrl = "https://s3.amazonaws.com/" + albumBucketName + '/';
    addAllPhotos(bucketUrl, data);
  });
}
*/


//adds a photo to our S3 database
function addPhoto(req, res) {
  const user = req.body.data.user;
  // data {user, file}
  console.log('addPhoto');
  var photoKey = user._id;
  //TODO: upload the file to s3

  var params = {Key: photoKey, Body: file, ACL: 'public-read'};
  s3.upload(params, function(err, data){
    if (err){
      console.log('err', err);
      return alert('There was an error uploading photo' + err.message);
    }
    console.log('Successfully uploaded photo.');
  });

}

module.exports = { addPhoto };
