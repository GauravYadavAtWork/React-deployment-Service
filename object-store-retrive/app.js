const express = require('express');
const cors = require('cors');
const getfiles = require('./routes/retriveFile.route.js');
const verifyRequest = require('./middleware/verifyRequest.js');
const port = process.env.PORT || 5500;
const app = express();

const corsoptions = {
    origin : '*',
    methods : ['GET']
}
app.use(cors(corsoptions));
app.use(verifyRequest);
app.use('*',getfiles);

app.use(function(err,req,res,next){
    res.send(err);
});

app.listen(port,()=>{
    console.log(`Server Listening on Port ${port}`);
});