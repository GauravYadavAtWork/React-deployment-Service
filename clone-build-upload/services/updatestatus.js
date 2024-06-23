const dotenv = require('dotenv');
dotenv.config();

const updateStatus = (projectid,nstatus)=>{

    return new Promise(async (resolve,reject)=>{
            const url = process.env.handlerserverurl + '/updateStatus';
            const data = {
              prjid: projectid,
              newstatus: nstatus
            };
          
            try {
              const response = await fetch(url, {
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
            //   console.log(responseData.message); // logs confirmation message
              resolve(responseData.message);
            } catch (error) {
            //   console.error(error.message); // logs error message
              reject(error.message);
            }
    })
}

module.exports = updateStatus;