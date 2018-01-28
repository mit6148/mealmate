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

//adds a photo to our S3 database
function addPhoto(photokey, profpic, callback){
  //console.log(data.file);
  //const user = data.user;
  // data {user, file}
  console.log('addPhoto');
  //var photoKey = user._id;
  //TODO: upload the file to s3
  console.log("tag", profpic);
  var params = {Key: photokey, Body: profpic.data, ACL: 'public-read'};
  s3.upload(params, function(err, data){
    if (err){
      console.log('err', err);
      return err;
    }
    console.log('Successfully uploaded photo.', data);
    callback();
  });

}

module.exports = { addPhoto };
