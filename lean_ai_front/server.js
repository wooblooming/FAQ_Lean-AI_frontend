// server.js
require('dotenv').config({ path: '.env.local' });

const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const port = process.env.NEXT_FRONT_PORT;
console.log('ENV PORT:', process.env.NEXT_FRONT_PORT);


const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./certificates/localhost-key.pem'),
  cert: fs.readFileSync('./certificates/localhost.pem')
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${port}`);
  });
});