const path =  require('path');

console.log(__filename);
console.log(__dirname);

console.log('#####################')

console.log('basename' , path.basename(__filename));
console.log('basename' , path.basename(__dirname));


console.log('#####################')

console.log('extname' , path.extname(__filename))

console.log('#####################') 

console.log('parse' , path.parse(__filename));

console.log('#####################')
console.log('format' , path.format(path.parse(__filename)));
console.log('#####################');
console.log('isAbsolute' , path.isAbsolute(__filename))

console.log('#####################');
console.log(path.join('folder1' , 'folder2' , 'index.html'))
console.log(path.join('/folder1' , 'folder2' , 'index.html'))
console.log(path.join('/folder1' , '//folder2' , 'index.html'))
console.log(path.join('/folder1' , 'folder2' , '../index.html'))
console.log(path.join(__dirname , '../data.json'))

console.log('#####################');

console.log(path.resolve('folder1' , 'folder2' , 'index.html'))
console.log(path.resolve('/folder1' , 'folder2' , 'index.html'))
console.log(path.resolve('/folder1' , '//folder2' , 'index.html'))
console.log(path.resolve('/folder1' , 'folder2' , '../index.html'))
console.log(path.resolve(__dirname , '../data.json'))