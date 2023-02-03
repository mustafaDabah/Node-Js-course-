const http =  require('http');
const path =  require('path');
const fs =  require('fs');
// const fsPromise =  require('fs').promises;

const PORT = 3500;
const pathPage = (page) => path.join(__dirname , page)

const server = http.createServer((req , res) => {
    // console.log(req.url , req.method);

    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    res.writeHead(200 , {"Content-Type": contentType});

    let resValue; 

    switch(req.url) {
        case '/': {
            resValue = pathPage('index.html');
            break;
        };
        case '/about.html': {
            resValue = pathPage('about.html');
            break;
        };
        case '/api.json': {
            resValue = JSON.stringify({
                name:'mustafa',
                'last': 'dabah'
            });

            break;
        };
        default: {
            resValue = pathPage('404.html');

            break; 
        };
    }

    console.log(req.url.slice(-1))

    res.end(resValue)
    fs.createReadStream(resValue).pipe(res)
})

server.listen(PORT , () => console.log(`running server on port ${PORT}`));

/*
// >>> this way not efficient

 switch(req.url) {
        case '/': {
            res.statusCode = 200;
            const HomePage = path.join(__dirname , 'index.html');
            fs.createReadStream(HomePage).pipe(res)
        }

    }


*/