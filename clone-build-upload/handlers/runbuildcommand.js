const {exec} = require('child_process');

const runBuildCommand = (path)=>{
    return new Promise ((resolve,reject)=>{ 
        console.log('Running Build Command');
        exec('npm run build', { cwd: path }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
            }
            else if (stderr) {
                console.error(`stderr: ${stderr}`);
                resolve(stderr);
            }else {
                console.log(`stdout: ${stdout}`);
                resolve(stdout);
            }
        });
    })
}

module.exports = runBuildCommand;