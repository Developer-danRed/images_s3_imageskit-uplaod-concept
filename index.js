const express = require('express');
const multer = require('multer');
const ImageKit = require('imagekit');

const app = express()
// SDK initialization
const imagekit = new ImageKit({
    publicKey: '<your_public_key>',
    privateKey: '<your_private_key>',
    urlEndpoint: '<your_url_endpoint>'
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//images upload

app.post('/upload', upload.array('images'), (req, res) => {
    const files = req.files;

    const promises = files.map(file => {
        return new Promise((resolve, reject) => {
            imagekit.upload({
                file: file.buffer,
                fileName: file.originalname
            }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });

    Promise.all(promises)
        .then(results => {
            res.json({ results });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});


//imagekit upload


const imageUrl = imagekit.url({
    path: 'your/image/path.jpg',
    transformation: [
        {
            height: 400,
            width: 600
        }
    ]
});

console.log("imageUrl:----------->", imageUrl);

//s3 upload multiple images


const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_KEY'
});

const uploadmultiple = multer({ dest: 'uploads/' }); // uploads folder will store the uploaded files

app.post('/upload', uploadmultiple.array('images'), (req, res) => {
    const files = req.files;

    // Loop through the uploaded files and upload them to S3
    files.forEach(file => {
        const params = {
            Bucket: 'YOUR_BUCKET_NAME',
            Key: file.originalname, // use the original file name as the S3 object key
            Body: file.buffer // the file content
        };
        s3.upload(params, (err, data) => {
            if (err) {
                console.log('Error uploading file:', err);
            } else {
                console.log('File uploaded successfully:', data.Location);
            }
        });
    });

    res.send('Files uploaded successfully');
});

// putobject method s3

const bucketName = 'your-bucket-name';
const imageKey = 'path/to/image.jpg';
const imagePath = 'path/to/local/image.jpg';

// Read image from file
const image = fs.readFileSync(imagePath);

// Upload image to S3
const s3Params = {
    Bucket: bucketName,
    Key: imageKey,
    Body: image,
    ContentType: 'image/jpeg',
};

s3.putObject(s3Params, (err, s3Data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Image uploaded to S3 successfully. URL: https://${bucketName}.s3.amazonaws.com/${imageKey}`);
    }
});


app.listen(3000, () => {
    console.log("Httpserver started Success");
})
