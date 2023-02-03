const http =  require('http');
const {Worker} =  require('worker_threads');
const path =  require('path');

const server = http.createServer((req , res) => {
    if(req.url === '/') {
        res.writeHead(200, {"Content-Type": "Text/plain"});
        res.end("Home page")       
    }else if (req.url === '/slow-page') {
        const worker = new Worker(path.join(__dirname ,  'worker-thread.js'))
        // let j = 0
        // for (let i = 0; i < 600000000; i++) {
        //     j++
        // }
        worker.on('message' , (j) => {
            res.writeHead(200, {"Content-Type": "Text/plain"});
            res.end(`slow page ${j}`)   
        })
    }
})
server.listen(8000 , () => console.log('server is running on port 8000'))