const buffer = new Buffer.from('mustafa');

buffer.write('dabah')

console.log(buffer.toString());  
console.log(buffer.toJSON()); // print uniQuecode 
console.log(buffer) // print unicode but in hexdecimail 