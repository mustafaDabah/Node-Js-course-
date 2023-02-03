const http =  require('http');
const fs =  require('fs');

const server = http.createServer((req , res) => {
    // res.end(req.url)
    if(req.url === '/') {
        res.writeHead(200 , {"Content-Type": "text/plain"});
        res.end("home page")
    } else if (req.url === '/about') {
        res.writeHead(200 , {"Content-Type": "text/plain"});
        res.end("about page")
    } else if (req.url === '/api') {
        res.writeHead(200 , {"Content-Type": "application/json"});
        res.end(JSON.stringify({
            firstName:'mustafa'
        }))
    }
});

server.listen(3000 , () => {
    console.log('server running port 3000')
})