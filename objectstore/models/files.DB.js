const mongoose = require('./database.js');
const { GridFSBucket } = require('mongodb');

let bucket;

function initializeBucket() {
    if (!bucket) {
        const connection = mongoose.connection;
        bucket = new GridFSBucket(connection.db);
    }
}
 
function getBucket() {
    initializeBucket(); // Ensure bucket is initialized before returning
    return bucket;
}

module.exports = {
    initializeBucket,
    getBucket
};
