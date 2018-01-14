'use strict';

const http = require('http');
const personStream = require('./9digital-stream');

const server = http.createServer((req, res) => {
  // only support 'POST'
  if (req.method !== 'POST') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ "error": "Only 'POST' supported " }));
    res.end();
  } else {
    req.pipe(personStream(res));
  }
});

server.listen(process.env.PORT || 3000);
