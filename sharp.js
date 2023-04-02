const fs = require('fs');
const sharp = require('sharp');

const inputDir = 'path/to/input/directory';
const outputDir = 'path/to/output/directory';
const width = 800;
const height = 600;

fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    for (const file of files) {
      const inputPath = `${inputDir}/${file}`;
      const outputPath = `${outputDir}/${file}`;
      console.log(`Resizing image: ${inputPath}`);
      sharp(inputPath)
        .resize(width, height)
        .toFile(outputPath, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Resized image saved: ${outputPath}`);
          }
        });
    }
  }
});
