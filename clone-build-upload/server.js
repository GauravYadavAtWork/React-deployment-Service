//--------------------------------------------actual code---------------------------------------

const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
const updateLogs = require('./services/updatelogs.js');
const updateStatus = require('./services/updatestatus.js');
let isBusy = false;

// handlers
const cloneRepo = require('./handlers/clonerepo.js');
const installDependencies = require('./handlers/installDependencies.js');
const runBuildCommand = require('./handlers/runbuildcommand.js');
const deleteUnnecessayFiles = require('./handlers/deleteunnecessaryfiles.js');
const uploadBuild = require('./handlers/uploadbuild.js');

// const processConfig = {
//     repoURL : 'https://github.com/GauravYadavAtWork/StaticWebpagesHostServiceFrontEnd.git',
//     buildDIR : 'build',
//     projectId : 'secondprj'
// }

const startBuild = async (config)=>{
    try {
        console.log("Starting Process for config :",config);
        updateStatus(config.projectId , 'Building')
        updateLogs(config.projectId , 'Cloning repository...');
        const clonedata = await cloneRepo(config);
        console.log(clonedata);
        updateLogs(config.projectId , clonedata);
        
        
        updateLogs(config.projectId , "Running npm install...");
        const installdata = await installDependencies(path.join(__dirname,'clonedrepos'));
        console.log(installdata);
        updateLogs(config.projectId , installdata);
        
        updateLogs(config.projectId , 'npm run build');
        const builddata = await runBuildCommand(path.join(__dirname,'clonedrepos'));
        console.log(builddata);
        updateLogs(config.projectId , builddata);
        
        
        const uploadbuilddata = await uploadBuild(path.join(__dirname,'clonedrepos'),config.buildDIR,config.projectId);
        console.log(uploadbuilddata);
        updateLogs(config.projectId , uploadbuilddata);
        
        const deletedata = await deleteUnnecessayFiles(path.join(__dirname,'clonedrepos'));
        console.log(deletedata);
        
        isBusy = false;
        updateLogs(config.projectId , 'Service is Live...');
        updateLogs(config.projectId , 'http://'+config.projectId + process.env.linkprovider);
        updateStatus(config.projectId , 'Live');
    }catch (error) {
        console.log("An Error Occured...",error);
        console.log('\n');
        console.log("Initializing cleanup process");

        const deletedata = await deleteUnnecessayFiles(path.join(__dirname,'clonedrepos'));
        console.log(deletedata);

        const data = await fetch(`${process.env.OBJECTSTOREDELETEURL}/${processConfig.projectId}`,{
            method : 'DELETE'
        });
        const responseData = await data.json();
        console.log(responseData);

        console.log('\n CleanUp data completed');
        isBusy = false;
    }
}

// startBuild(processConfig);

setInterval(async()=>{
    if(!isBusy){
        const data = await fetch(`${process.env.QUEUESERVICEURL}/pop`,{
            method : 'GET'
        });
        const response = await data.json();
        if(response!=null){
            startBuild(response);
            isBusy = true;
        }
    }
},100);


// firstprj 