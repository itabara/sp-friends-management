const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const api = require('./api/friends');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', api);

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.status(500).send({
    message: err.message,
    error: {}
  });
});

const port = process.env.PORT || '4200';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));

module.exports = server