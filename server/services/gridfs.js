const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const path = require('path');


module.exports = MONGODB_URI => {
    const storage = new GridFsStorage({
        url: MONGODB_URI,
        cache: true,
        file: (req, file) => {
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const extension = file.mimetype.split('/')[1];
                const filename = buf.toString('hex') + '.' + extension;
                const fileInfo = {
                    filename: filename,
                    bucketName: 'photos'
                };
                resolve(fileInfo);
                });
            });
        }
    });
    
    return multer({ storage });
}
