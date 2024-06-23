const express = require('express');
const fs = require('fs');
const upload = require('../middlewares/middleware.multer.js');
const fileIndex = require('../models/file.Indexing.js');
const router = express.Router();
const { getBucket } = require('../models/files.DB.js');


router.post('/' , upload.single('file'), (req, res) => {
    const { filename, mimetype } = req.file;
    const bucket = getBucket();

    const readStream = fs.createReadStream(req.file.path);
    const uploadStream = bucket.openUploadStream(filename, { contentType: mimetype });

    readStream.pipe(uploadStream);

    uploadStream.on('error', (error) => {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'An error occurred while uploading the file' });
    });

    uploadStream.on('finish', async() => {
        fs.unlinkSync(req.file.path); // Delete temporary file
        console.log('File uploaded successfully:', uploadStream.id);
        // file id = uploadStream.id;  save it to the database in the fileindexingDB
        // project id = req.body.projectid;
        // file indexing  = filepath;
        console.log(mimetype);
        const newfile = new fileIndex({
            projectId: req.body.projectId,
            fileIndexing : req.body.filepath,
            fileid: uploadStream.id,
            contentType : mimetype
        });
        newfile.save().then(()=>{
            res.status(200).json({ message: 'File uploaded successfully', IndexingID: newfile._id });
        })
        .catch((err)=>{
            res.status(500).json({ Error: err});
        })
    });
});

module.exports = router;