const fs =  require("fs");
const path =  require('path');


const filePath = path.resolve(__dirname ,  "./files/file.txt");

const fileContents = fs.readFileSync(filePath)
console.log(fileContents);

fs.readFile(filePath , "utf-8" , (error , data) => {
    if (error) {
        console.log(error)
    } else {
        console.log(data)
    }
});

fs.writeFileSync(filePath , ' hello world mostafa' , {flag: 'a'});

fs.writeFile('./greet.txt' , 'hello mostafa' , (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log('success')
    }
});
