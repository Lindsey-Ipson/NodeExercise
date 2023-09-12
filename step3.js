const fs = require('fs');
const process = require('process');
const axios = require('axios');


function writeOrPrint(text, fileToWrite) {
  if (fileToWrite) {
    fs.writeFile(fileToWrite, text, 'utf8', function(err) {
      if (err) {
        console.error(`Couldn't write to ${fileToWrite}: ${err}`);
        process.exit(1);
      }
    });
  } else {
    console.log(text);
  }
}


function cat(path, fileToWrite) {
  fs.readFile(path, 'utf8', function(err, data) {
    if (err) {
      console.error(`Error reading ${path}: ${err}`);
      process.exit(1);
    } else {
      writeOrPrint(data, fileToWrite);
    }
  });
}


async function webCat(url, fileToWrite) {
  try {
    let resp = await axios.get(url);
    writeOrPrint(resp.data, fileToWrite);
  } catch (err) {
    console.error(`Error fetching ${url}: ${err}`);
    process.exit(1);
  }
}


let path;
let fileToWrite;

if (process.argv[2] === '--out') {
  fileToWrite = process.argv[3];
  path = process.argv[4];
} else {
  path = process.argv[2];
}

if (path.startsWith('http')) {
  webCat(path, fileToWrite);
} else {
  cat(path, fileToWrite);
}