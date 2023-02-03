const fs =  require('fs');
const path =  require('path');


// read async way
fs.readFile(path.join(__dirname , 'files' , 'file.txt') , 'utf-8' , (err , data) => {
    if (err) {
        console.log(error)
    } else {
        console.log(data)
    }
});


// read sync way
const readFile = fs.readFileSync(path.join(__dirname , 'files' , 'file.txt') , 'utf-8');
console.log(readFile)


// write async way
fs.writeFile(path.join(__dirname , 'files' , 'newFile.txt') , 'hello mostafa' , (err) => {
    if (err) {
        console.log(error)
    }
});

// append async way
fs.appendFile(path.join(__dirname , 'files' , 'newFile.txt') , '\nhello mostafa 2' , (err) => {
    if (err) {
        console.log(error)
    }
});

// create and append and rename 
fs.writeFile(path.join(__dirname , 'files' , 'newFile2.txt') , 'hello mostafa' , (err) => {
    if (err) {
        console.log(error)
    }
    console.log('create new file')

    fs.appendFile(path.join(__dirname , 'files' , 'newFile2.txt') , '\n\ How are you' , (err) => {
        if (err) {
            console.log(error)
        }
        console.log('append new file')

        fs.rename(path.join(__dirname , 'files' , 'newFile2.txt') , path.join(__dirname , 'files' , 'rename.txt') , (err) => {
            if (err) {
                console.log(error)
            }
            console.log('rename')
        })

    });
});

// make new dir 
if(!fs.existsSync(path.join(__dirname , 'files' , 'new'))) {
    fs.mkdir(path.join(__dirname , 'files' , 'new') , (err) => {
        if (err) {
            console.log(err)
        }
        console.log('make new dir')
    })
}

// remove new dir 
if(fs.existsSync(path.join(__dirname , 'files' , 'new'))) {
    fs.rmdir(path.join(__dirname , 'files' , 'new') , (err) => {
        if (err) {
            console.log(err) 
        }
        console.log('remove new dir')
    })
}

console.log('first')

process.on('uncaughtException' , (err) => {
    console.error(`there was an uncaught error: ${err}`);
    process.exit(1)
})