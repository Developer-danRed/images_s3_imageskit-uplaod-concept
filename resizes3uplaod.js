const AWS = require('aws-sdk');
const sharp = require('sharp');
const fs = require('fs');

const s3 = new AWS.S3();

// Read image from file
const image = fs.readFileSync('path/to/image.jpg');

// Resize image using sharp
const resizedImage = await sharp(image)
  .resize(800, 600)
  .toBuffer();

// Upload resized image to S3
const params = {
  Bucket: 'your-bucket-name',
  Key: 'path/to/resized-image.jpg',
  Body: resizedImage,
};

s3.upload(params, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Image uploaded successfully. URL: ${data.Location}`);
  }
});
