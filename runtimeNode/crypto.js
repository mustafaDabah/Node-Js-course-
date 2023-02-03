// const crypto = require('crypto');
const https =  require('https');

// process.env.UV_THREADPOOL_SIZE = 8;

const start = new Date();
 
// crypto.pbkdf2Sync('password' , 'salt' , 10000 , 512 , 'sha512');
// crypto.pbkdf2Sync('password' , 'salt' , 10000 , 512 , 'sha512');
// crypto.pbkdf2Sync('password' , 'salt' , 10000 , 512 , 'sha512');
// console.log("hash: " , Date.now() - start);

const MAX_CALLS = 6 ; 

for (let i = 0; i < MAX_CALLS; i++) {
    // crypto.pbkdf2('password' , 'salt' , 10000 , 512 , 'sha512' , () => {
    //     console.log(`hash: ${i + 1}` , Date.now() - start)
    // });
    https.request('https://www.google.com' , res => {
        res.on('data' , () => {})
        res.on('end' , () => {
            console.log(`reuest ${i + 1}`, Date.now() - start);
        })
    }).end()
}