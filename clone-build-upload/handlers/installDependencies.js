const { exec } = require('child_process');

const installDependencies = (path) => {
    return new Promise((resolve, reject) => {
        console.log('Running npm install...');
        exec('npm install', { cwd: path }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing npm install: ${error}`);
                reject(error);
            } else if (stderr) {
                console.error(`npm install encountered an error: ${stderr}`);
                resolve(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
};

module.exports = installDependencies;