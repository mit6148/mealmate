var albumBucketName = process.env.S3_BUCKET_NAME;
var bucketRegion = process.env.S3_BUCKET_REGION;
var IdentityPoolId = process.env.S3_IDENTITY_POOL_ID;


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

//Source: https://stackoverflow.com/questions/12368910/html-display-image-after-selecting-filename
function readURL(file) {
    var reader = new FileReader();

    reader.onload = function (e) {
        $('#userImage')
            .attr('src', e.target.result)
            .width(150)
            .height(150);
    };

    reader.readAsDataURL(file);
}

//adds a photo to our S3 database
function addPhoto(user, callback) {
  console.log('addPhoto');
  //get the file out of the upload widget
  var files = document.getElementById('photoupload').files;
  if (!files.length) {
    console.log('no image');
    return alert('Please choose a file to upload first.');
  }
  var file = files[0];
  readURL(file);
  var photoKey = user._id;
  //TODO: upload the file to s3

  var params = {Key: photoKey, Body: file, ACL: 'public-read'};
  s3.upload(params, function(err, data){
    if (err){
      console.log('err', err);
      return alert('There was an error uploading photo' + err.message);
    }
    console.log('Successfully uploaded photo.');
    //callback();
  });

}


