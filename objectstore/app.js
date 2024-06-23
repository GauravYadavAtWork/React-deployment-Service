const express = require('express');
const cors = require('cors');
const upload = require('./routes/upload.route.js');
const retriveFile = require('./routes/retriveFile.route.js');
const deletePRJ = require('./routes/deletePRJ.route.js');
// const store = require('./routes/store.route.js');
const dotenv = require('dotenv');
dotenv.config();

const corsoptions = {
    origin : '*',
    methods : ['GET','POST','DELETE','PUT']
}

const app = express();
const port = 8080;

app.use(cors(corsoptions));
app.use(express.urlencoded({extended:true}))


app.use('/upload',upload);
app.use('/file',retriveFile);
app.use('/deleteprj',deletePRJ);


app.listen(port || process.env.PORT ,()=>{
    console.log(`Server Listening on PORT ${port}`);
});