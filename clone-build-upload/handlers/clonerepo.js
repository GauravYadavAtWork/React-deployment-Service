const simpleGit = require('simple-git');

const cloneRepo = (config)=>{
    return new Promise ((resolve,reject)=>{ 
        console.log('Cloning repo...');
        simpleGit().clone(config.repoURL, 'clonedrepos', (err, result) => {
            if (err) {
              console.log('Failed to clone repository:', err);
              reject(err);
            } else {
              resolve('Repository cloned successfully');
            }
        });
    })
}

module.exports = cloneRepo;