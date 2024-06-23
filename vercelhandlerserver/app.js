const express=require('express')
const mongoose=require('mongoose');
const cors=require('cors');
const bodyParser=require('body-parser')
const dotenv = require('dotenv');
dotenv.config();

const app = express()
app.use(bodyParser.urlencoded({extended:true}));

const Schema = mongoose.Schema;


mongoose.connect(process.env.DATABASE_URL)
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch((error)=>{
    console.log('error in connection');
})

const myDataSchema = new Schema({
    name:String,
    project:String,
    url:String,
    build:String,
    Status:{
      type:String,
      default:'Queued'
    },
    Logs:{
      type : [String],
      default : ['Request Queued to the Queue Service']
    }
});

const MyData = mongoose.model('projectsCollection',myDataSchema);

app.use(express.json());

app.use(cors({
    origin:'*',
    method:['GET','POST','PUT','DELETE'],
}));


app.get('/check-project',async(req,res)=>{
  try{
    const prjname = req.query.name;
    const data = await MyData.findOne({project:prjname});
    if(!data) res.status(200).json({available:true});
    else res.status(403).json({available:false});
  }catch(err){
    res.status(500).json({message:"Internal Server Error"});
  }
});


app.post('/submit-form',async function(req,res){
    try{
      console.log(req.body);
        const{name,project,url,build}=req.body;
        const data={name,project,url,build};
        const isExist=await MyData.findOne({project:project});
        if(isExist){
            res.status(200).json({message:"Project already exists"});
        }
        else if(!name || !project || !url || !build){
            res.status(400).json({message:"All fields are required"});
        }
        else {
          const newdata = new MyData({
              name : name,
              project : project,
              url : url,
              build: build
          });
          await newdata.save();
          const urll = process.env.queueserver + '/push';
          const data = {
            repoURL : url,
            buildDIR : build,
            projectId : project
          };
          const response = await fetch(urll, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
      
          if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message || 'Failed to update logs');
          }
      
          const responseData = await response.json();
          res.status(200).json({ message:"Data Queued Successfully"});      
    }
  }
    catch(error){
      console.log(error);
        res.status(500).json({message:error.message});
    }
});

app.post('/push',function(req,res){
    //now pushing that data in queue;
    // queue.enqueue(data);
    res.status(200).json({ message:"Data Queued Successfully"});
})

app.get('/project-status/:prjid', async (req, res) => {
    try {
      //show logs
      // console.log("Status request",req.params.prjid);
      const Logs = await MyData.findOne({project:req.params.prjid});
      // console.log(Logs);
      if(Logs) res.status(200).json({ prjstatus: Logs.Status});
    } catch (error) {
      // Handle errors
      console.error('Error fetching project status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.get('/project-logs/:prjid', async (req, res) => {
    try {
      //show logs
      // console.log("Status request",req.params.prjid);
      const Logs = await MyData.findOne({project:req.params.prjid});
      // console.log(Logs);
      if(Logs) res.status(200).json({ prjlogs: Logs.Logs});
    } catch (error) {
      // Handle errors
      console.error('Error fetching project status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.post('/updateStatus',async (req,res)=>{
  try{
    const prjid = req.body.prjid;
    const newstatus = req.body.newstatus;
    const data = await MyData.updateOne({project:prjid},{Status:newstatus});
    res.status(200).json({message:"Updated successfully"});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"Internal server error"});
  }
});

app.post('/updateLogs',async (req,res)=>{
  try{
    const prjid = req.body.prjid;
    const newlog = req.body.newlog;
    const data = await MyData.updateOne({project:prjid},{$push: {Logs:newlog}});
    res.status(200).json({message:"logs Updated successfully"});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"Internal server error"});
  }
});

app.listen(3001,()=>{
    console.log("Listening on port 3001");
}) 
