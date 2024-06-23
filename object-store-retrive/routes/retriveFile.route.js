const express = require('express');
const mongoose = require('../models/database.js');
const { getBucket } = require('../models/files.DB.js');
const fileIndex = require('../models/file.Indexing.js');

const router = express.Router();

router.get('*' , async (req, res) => {
    try{
        if(true){
            // const fileIndexingData = await fileIndex.findOne({
            //     projectId:req.params.projectId,
            //     fileIndexing:req.body.fileIndex
            // });
            // console.log('Searched for file',fileIndexingData);
            // if(!fileIndexingData) return res.status(404).json({message:"No file found"})
            console.log("Searching for file with id",req.fileIndexingData.fileid);
            const fileID = new mongoose.Types.ObjectId(req.fileIndexingData.fileid);
            const bucket = getBucket();
            const readStream = bucket.openDownloadStream(fileID);
            readStream.pipe(res);
            readStream.on('error', (error) => {
                console.error('Error streaming file:', error);
                throw new Error('Error in streaming the file');
            });
        }else{
            res.status(400).json({ error: 'Unauthorized File Requested' });
        }
    }catch{
        res.status(500).json({ error: 'An error occurred while streaming the file' });
    }
});

module.exports = router;