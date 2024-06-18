import http from 'http';
import fs from 'fs';

http
  .createServer((req, res) => {
    if (req.url === '/auth0/callback') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync('./callback.html'));
    } else if (req.url === '/main.js') {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(fs.readFileSync('./main.js'));
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync('./index.html'));
    }
  })
  .listen(3000);
