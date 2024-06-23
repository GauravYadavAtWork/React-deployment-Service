const express = require('express');
const simpleGit = require('simple-git');
const path  = require('path');
const fs = require('fs');
const {exec} = require('child_process');
const app = express();
app.use(express.json());
const updateLogs = require('./services/updatelogs.js');
const updateStatus = require('./services/updatestatus.js');


app.post('/',function(req,res){
    // Clone a repository
    simpleGit().clone(req.body.url, 'clonedrepos', (err, result) => {
        if (err) {
          console.error('Failed to clone repository:', err);
        } else {
          console.log('Repository cloned successfully:', result);
          res.send(result);
        }
    });
});

app.get('/install', function(req, res) {
    exec('npm install', { cwd: path.join(__dirname, 'clonedrepos') }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).send(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            res.status(500).send(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.send(`npm install completed successfully.`);
    });
});

// Route to run npm run build
app.get('/build', function(req, res) {
    exec('npm run build', { cwd: path.join(__dirname, 'clonedrepos') }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).send(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            res.status(500).send(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.send(`npm run build completed successfully.`);
    });
});


app.get('/delete', function(req, res) {
    const clonedReposDir = path.join(__dirname, 'clonedrepos');

    // Function to recursively delete files and folders
    const deleteFolderRecursive = function(directory) {
        if (fs.existsSync(directory)) {
            fs.readdirSync(directory).forEach((file) => {
                const curPath = path.join(directory, file);
                if (fs.lstatSync(curPath).isDirectory()) { // Recursive call for directories
                    if (file !== 'build') { // Skip 'build' directory
                        deleteFolderRecursive(curPath);
                    }
                } else { // Delete files
                    fs.unlinkSync(curPath);
                }
            });
            // After deleting files, delete the empty directory
            if (directory !== clonedReposDir) { // Don't delete the main directory
                fs.rmdirSync(directory);
            }
        }
    };

    // Start deletion process
    deleteFolderRecursive(clonedReposDir);

    res.send(`Files and folders (except 'build') deleted successfully.`);
});


// Route to read all files from the build folder and return their paths and names
app.get('/readfiles', function(req, res) {
    const buildFolderPath = path.join(__dirname, 'clonedrepos', 'build');

    // Function to recursively read files from a directory
    const readFilesRecursive = function(directory) {
        const fileList = [];

        // Read contents of the directory
        const files = fs.readdirSync(directory);

        // Iterate through each file in the directory
        files.forEach(file => {
            const filePath = path.join(directory, file);
            const stat = fs.statSync(filePath);

            // If it's a directory, recursively read its files
            if (stat.isDirectory()) {
                fileList.push(...readFilesRecursive(filePath));
            } else {
                // If it's a file, add its path and name to the list
                fileList.push({ path: filePath, name: file });
            }
        });
        return fileList;
    };

    try {
        // Read files recursively from the build folder
        const fileList = readFilesRecursive(buildFolderPath);
        res.json(fileList); // Send the list of files as a JSON response
    } catch (error) {
        console.error('Error reading files:', error);
        res.status(500).send('Internal Server Error');
    }
});

function globalcatch(err,req,res,next){
    if(err){
        console.log(err);
        res.json({message:'Some Problem With Our Server',error:err});
    }
}
app.use(globalcatch);

app.listen(3000);



/* the hirarcy is that
1. middleware => has 3 args (req,res,next)
-> applied before the core logic 

2. core logic => has 2 args (req,res)

3. global catches => has 4 args (err,req,res,next)
-> global catches is called error handling middleware
-> placed at the end of all the requests
*/


/*
app.method('*', ...chain of callbacks) 
*/