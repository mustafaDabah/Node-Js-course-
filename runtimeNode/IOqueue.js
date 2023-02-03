const fs =  require('fs');



fs.readFile(__filename , () => {
    console.log('this readfile')
})


process.nextTick(() => console.log("this is process.nextTick 1"));
Promise.resolve().then(() => console.log("this is Promise.resolve 1"));
setTimeout(() => console.log("this is  setTimeout "), 0);
setImmediate(() =>  console.log("this is  setImmediate "));
