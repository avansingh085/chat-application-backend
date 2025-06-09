const cloudinary = require('../config/cloudinary.config');
const { Readable } = require('stream');

const uploadCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        console.log(error);
        return reject(error)};
      resolve(result);
    });

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

module.exports = uploadCloudinary;
