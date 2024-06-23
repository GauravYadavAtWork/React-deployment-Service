const fs = require('fs');
const path = require('path');

const deleteUnnecessaryFiles = (directoryPath) => {
    console.log('Deletion Process Initialized...!');
    return new Promise((resolve, reject) => {
        fs.rm(directoryPath, { recursive: true }, (err) => {
            if (err) {
                reject('Error while deleting directory:', err);
            } else {
                resolve('Directory deleted successfully')
            }
        });
    });
};


module.exports = deleteUnnecessaryFiles;