const fs =  require('node:fs/promises');
const path =  require('path');

async function createAR() {
    try {
        await fs.writeFile(path.join(__dirname , 'files' , 'newFile2.txt') , 'hello mostafa');
        await fs.appendFile(path.join(__dirname , 'files' , 'newFile2.txt') , '\n\ How are you');
        await fs.rename(path.join(__dirname , 'files' , 'newFile2.txt') , path.join(__dirname , 'files' , 'rename2.txt'));
        await fs.unlink(path.join(__dirname , 'files' , 'newFile.txt'))
    } catch (error) {
        console.log(error)
    }
}

createAR();

console.log('first')