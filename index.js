const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate =  require('./modules/replaceTemplate');

const templateOverview = fs.readFileSync(`${__dirname}/templates/templete-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/templete-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/templete-product.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {'Content-type': 'text/html'});

    const cardsHtml = dataObj.map(el => replaceTemplate(templateCard, el)).join();
    const output = templateOverview.replace(/%PRODUCTCARDS%/g , cardsHtml);
    // console.log(cardsHtml)
    res.end(output)


    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });

    const targetCard = dataObj[query.id]
    // const targetCard = dataObj.find(item => item.id === +query.id);
    const output = replaceTemplate(templateProduct , targetCard)

    res.end(output);
    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000 , () => {
    console.log('server run in 8000 port')
})