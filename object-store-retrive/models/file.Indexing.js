const mongoose = require("./database.js");

const indexingSchema = new mongoose.Schema({
    projectId:{
        type:String,
        required:true,
    },
    fileIndexing:{
        type:String,
        required:true
    },
    fileid: {
        type:String,
        required:true
    },
    contentType : {
        type: String,
    }
});

const fileIndex = new mongoose.model('filesIndexingDB',indexingSchema);
module.exports = fileIndex;