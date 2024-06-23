const fs = require('fs');
const path = require('path');
const dotenv  = require('dotenv');
const axios = require('axios');
const FormData = require('form-data');
dotenv.config();

const uploadBuildPath = (filepath, uploaddirname) => {
    const arr = filepath.split("\\");
    let str = "";
    let flag = false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].trim() == uploaddirname.trim()) {
            flag = true;
            continue;
        }
        if (flag) str += '/' + arr[i];
    }
    return str;
}

const uploadFile = async (filepath, uploaddirname, projectid) => {
    try {
        const customfilePath = uploadBuildPath(filepath, uploaddirname);
        
        // Create read stream for file
        const fileStream = fs.createReadStream(filepath);

        // Create form data
        const formData = new FormData();
        formData.append('file', fileStream);
        formData.append('filepath', customfilePath);
        formData.append('projectId', projectid);

        // Set headers for form data
        const headers = {
            ...formData.getHeaders(),
        };

        // Make HTTP POST request to upload the file
        const url = process.env.OBJECTSTOREURL; // Replace with your API endpoint
        const response = await axios.post(url, formData, { headers });

        console.log(`File uploaded successfully: ${customfilePath}`);
        console.log(`Response from server: ${response.data}`);
    } catch (error) {
        console.error(`Error uploading file ${filepath}: ${error.message}`);
    }
}

const uploadBuild = async (rootdir, uploadDirname, projectid) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Uploading Build...');
            const traverseDirectory = async (directory) => {
                const files = fs.readdirSync(directory);
                const promises = [];
                for (const file of files) {
                    const filePath = path.join(directory, file);
                    if (fs.statSync(filePath).isDirectory()) {
                        await traverseDirectory(filePath);
                    } else {
                        const promise = uploadFile(filePath, uploadDirname, projectid);
                        promises.push(promise);
                    }
                }
                await Promise.all(promises);
            };

            await traverseDirectory(path.join(rootdir, uploadDirname));
            resolve('Build Uploaded Successfully');
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = uploadBuild;