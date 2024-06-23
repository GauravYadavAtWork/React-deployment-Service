const express = require('express');
const mongoose = require('../models/database.js');
const { getBucket } = require('../models/files.DB.js');
const fileIndex = require('../models/file.Indexing.js');

const router = express.Router(); 

router.delete('/:projectId' , async (req, res) => { 
    try {
        const data = await fileIndex.find({ projectId: req.params.projectId });
        if (data.length === 0) {
            return res.status(400).json({ error: 'Project not found' });
        }
        
        const bucket = getBucket();
        for(const file of data){
            const fileID = new mongoose.Types.ObjectId(file.fileid);
            await bucket.delete(fileID);
        }

        await fileIndex.deleteMany({ projectId: req.params.projectId });
        res.status(200).json({ message: "Project Deleted Successfully" });
    } catch (error) { 
        console.error('An error occurred while deleting the file:', error);
        res.status(500).json({ error: 'An error occurred while deleting the file' });
    }
});

module.exports = router;
