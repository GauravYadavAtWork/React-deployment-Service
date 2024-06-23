//-----------------------------------------actual code-----------------------------------------
const express = require('express');
const cors = require('cors');
const mongoose = require('./models/database.js');
const { getBucket } = require('./models/files.DB.js');
const fileIndex = require('./models/file.Indexing.js');

const port = process.env.PORT || 5500;
const app = express();

const corsoptions = {
    origin : '*',
    methods : ['GET']
}

app.use(cors(corsoptions));

// Middleware to serve static files
app.use(async (req, res, next) => {
    try {
        const staticExtensions = ['.js', '.css', '.jpg', '.png', '.gif', '.ico','.svg'];
        
        const isStatic = staticExtensions.some(ext => req.url.endsWith(ext));

        if (!isStatic) {
            return next();
        }
        const projectId = req.hostname.split('.')[0];
        const fileIndexingData = await fileIndex.findOne({
            projectId: projectId,
            fileIndexing: req.url
        });
        if (!fileIndexingData) return res.status(404).json({ message: "No file found" });
        
        const fileID = new mongoose.Types.ObjectId(fileIndexingData.fileid);
        const bucket = getBucket();
        const readStream = bucket.openDownloadStream(fileID);
        console.log(fileIndexingData.contentType);
        res.set('Content-Type', fileIndexingData.contentType); // new line added , mime type also sent
        readStream.pipe(res);

        readStream.on('error', (error) => {
            console.error('Error streaming file:', error);
            res.status(500).json({ message: "Error in streaming the file" });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.get('*',async (req,res)=>{
    try{
        const projectId = req.hostname.split('.')[0];
        const fileIndexingData = await fileIndex.findOne({
            projectId:projectId,
            fileIndexing: '/index.html'
        });
        console.log('Searched for file',fileIndexingData);
        if(!fileIndexingData) return res.status(404).json({message:"No file found"})
        req.fileIndexingData = fileIndexingData;
        const fileID = new mongoose.Types.ObjectId(req.fileIndexingData.fileid);
        const bucket = getBucket();
        const readStream = bucket.openDownloadStream(fileID);
        readStream.pipe(res);
        readStream.on('error', (error) => {
            console.error('Error streaming file:', error);
            throw new Error('Error in streaming the file');
        });
    }
    catch(error){
        res.status(500).json({ err: error});
    }
})

app.use(function(err,req,res,next){
    res.send(err);
});

app.listen(port,()=>{
    console.log(`Server Listening on Port ${port}`);
});