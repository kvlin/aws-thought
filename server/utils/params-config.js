const { v4: uuidv4 } = require('uuid');

const params = fileName => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];

    const imageParams = {
        Bucket: 'user-images-b05f1e02-0f6b-4f4b-a6c1-1e71cf37b2d5',
        Key: `${uuidv4()}.${fileType}`, // uuid to ensure unique file name
        Body: fileName.buffer,
        ACL: 'public-read' // allow read access to this file
    };

    return imageParams;
}

module.exports = params;