const http =  require('http');
const cluster =  require('cluster');
const OS =  require('os');

console.log(OS.cpus().length)

if (cluster.isMaster) {
    console.log(`master process is ${process.pid}`)
    cluster.fork();
    cluster.fork();
} else {
    console.log(`worker ${process.pid} stated`)
    const server = http.createServer((req , res) => {
        if(req.url === '/') {
            res.writeHead(200, {"Content-Type": "Text/plain"});
            res.end("Home page")       
        }else if (req.url === '/slow-page') {
            for (let i = 0; i < 600000000; i++) {}
                res.writeHead(200, {"Content-Type": "Text/plain"});
                res.end("slow page")   
        }
    })
    server.listen(8000 , () => console.log('server is running on port 8000'))
}


