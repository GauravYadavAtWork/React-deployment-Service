const fileIndex = require('../models/file.Indexing.js');

const verifyRequest = async (req,res,next)=>{
    const projectId = req.hostname.split('.')[0];
    // console.log(req.hostname);
    // console.log(req.url);
    const fileIndexingData = await fileIndex.findOne({
        projectId:projectId,
        fileIndexing: req.url || '/index.html'
    });
    console.log('Searched for file',fileIndexingData);
    if(!fileIndexingData) return res.status(404).json({message:"No file found"})
    req.fileIndexingData = fileIndexingData;
    next();
}

module.exports = verifyRequest;