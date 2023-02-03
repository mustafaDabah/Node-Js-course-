const fs =  require('fs');
const path =  require('path');
const zlib =  require('zlib');


const readableStream = fs.createReadStream(path.resolve(__dirname , './files/file.txt') , {
    encoding:'utf-8',
    // highWaterMark: 2
}); 

const writeableStream = fs.createWriteStream(path.resolve(__dirname , './files/file2.txt'));

// >>>> Pipes 
readableStream.pipe(writeableStream);
 

// >>>> event emitter method 

// readableStream.on('data' , (chunk) => {
//     console.log(chunk);
//     writeableStream.write(chunk);
// }); 


// >>>> zlip 
const gzip = zlib.createGzip();
readableStream.pipe(gzip).pipe(fs.WriteStream(path.resolve(__dirname , './files/file2.txt.gz')))

process.on('uncaughtException' , (err) => {
    console.error(`there was an uncaught error: ${err}`);
    process.exit(1)
})

