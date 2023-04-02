const AWS = require('aws-sdk');
const sharp = require('sharp');
const ImageKit = require('imagekit');
const fs = require('fs');

const s3 = new AWS.S3();
const imagekit = new ImageKit({
  publicKey: 'your_public_api_key',
  privateKey: 'your_private_api_key',
  urlEndpoint: 'https://ik.imagekit.io/your_imagekit_id',
});

const bucketName = 'your-bucket-name';
const s3ImagePrefix = 'path/to/images/';
const imagekitFolder = '/path/to/images/';

// List all objects in the S3 bucket
const s3Params = {
  Bucket: bucketName,
  Prefix: s3ImagePrefix,
};
s3.listObjects(s3Params, async (err, s3Data) => {
  if (err) {
    console.log(err);
  } else {
    for (const object of s3Data.Contents) {
      const objectKey = object.Key;
      if (!objectKey.endsWith('/')) {
        console.log(`Resizing image: ${objectKey}`);
        // Download image from S3
        const s3Object = await s3.getObject({ Bucket: bucketName, Key: objectKey }).promise();
        // Resize image using sharp
        const resizedImage = await sharp(s3Object.Body)
          .resize(800, 600)
          .toBuffer();
        // Upload resized image to S3
        const s3ResizedImageKey = `${s3ImagePrefix}${objectKey.split('/').pop()}`;
        const s3ResizedImageParams = {
          Bucket: bucketName,
          Key: s3ResizedImageKey,
          Body: resizedImage,
        };
        const s3ResizedImageData = await s3.upload(s3ResizedImageParams).promise();
        console.log(`Resized image uploaded to S3: ${s3ResizedImageData.Location}`);
        // Upload resized image to ImageKit
        const imagekitParams = {
          fileName: s3ResizedImageKey,
          file: resizedImage,
          folder: imagekitFolder,
        };
        const imagekitData = await imagekit.upload(imagekitParams);
        console.log(`Resized image uploaded to ImageKit: ${imagekitData.url}`);
      }
    }
  }
});
