const fs =  require('node:fs/promises');
const path =  require('path');
const filePath = path.resolve(__dirname ,  "./files/file.txt");

console.log('first')

// promises
fs.readFile(filePath , 'utf-8')
 .then(data => console.log(data))
 .catch(error => console.log(error));

 console.log('second');
 
 // async 
async function readFile() {
    try {
        const data = await fs.readFile(filePath , 'utf-8');
        console.log(data);
    } catch (error) {
        console.log(error)
    }
}

readFile()
console.log('third');