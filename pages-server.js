const http = require('http');
const path = require('path');
const fs = require('fs');

class PagesServer {
  init() {
    const server = http.createServer((req, res) => {

      let filePath = path.join(
        __dirname,
        req.url === '/' ? 'index' : req.url
      );

      let extname = path.extname(filePath) || '.html';
      let contentType = 'text/html';

      switch (extname) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpg';
          break;
      }

      fs.readFile(
        path.extname(filePath) ? filePath : filePath + extname,
        'utf8',
        (err, content) => {
          if (err) {
            if (err.code == 'ENOENT') {
              // page not found
              fs.readFile(
                path.join(__dirname, 'index.html'),
                'utf8',
                (err, content) => {
                  res.writeHead(200, { 'Content-Type': 'text/html' });
                  res.end(content);
                }
              )
            } else {
              // Some Server Error
              res.writeHead(500);
              res.end(`Server Error: ${err.code}`);
            }
          } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
          }
        }
      );
    });

    return server;
  }
}

const pagesServerFactory = new PagesServer();
const server = pagesServerFactory.init();

exports.server = server;