const mongoose = require('./database.js');

const fileSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    filename: String,
    contentType: String
}, { collection: 'fs.files' }); // Collection name is fs.files

const File = mongoose.model('File', fileSchema);
module.exports = File;