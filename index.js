const fs =  require("fs");


const fileContents = fs.readFileSync("./text.txt" , 'utf-8')

console.log(fileContents);
