const http =  require('node:http');
const fs =  require('fs');
const path =  require('path');


const server = http.createServer((req , res) => {
    const name = 'mustafa'
    res.writeHead(200 , {"Content-Type":"text/html"});

    const superHero = {
        firstName:'mustafa',
        lastName:'dabah'
    }

    if (req.url === '/') {
        res.write('<h1>Hello World</h1>')
    }

    // console.log(req)
    // >>> json response // application/json
    // res.end(JSON.stringify(superHero));

    // >>> text response  // text/plain
    // res.end('hello world ')


    // >>> text response  // text/html
    // let readFileHtml = fs.readFileSync(path.join(__dirname , 'index.html') , 'utf-8');
    // readFileHtml.replace("{{name}}" , name)
    // res.end(readFileHtml)

     // >>> text response  // text/html put using stream more effecieny
    // fs.createReadStream(path.join(__dirname , 'index.html')).pipe(res)


    
})

server.listen(3000 , () => {
    console.log('server running port 3000')
})