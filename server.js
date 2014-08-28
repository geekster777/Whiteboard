var http = require('http');
var fs = require('fs');
var path = require('path');
var io = require('socket.io');

var publicDir = '/public';

var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"};

function getExtension(filename) {
  return path.extname(filename).split(".").reverse()[0];
}

var app = http.createServer(function(req, res) {
  if(!req.url || req.url == '/') {
    req.url = '/index.html';
  }

  console.log(req.url);
  if(req.url.indexOf('/api') == 0) {
    res.writeHead(200, {"ContentType":"text/plain"});
    res.end('You have reached the API');
  }
  else {
    console.log(__dirname+publicDir+req.url);
    fs.readFile(__dirname+publicDir+req.url, function(err, data) {
      if(err) {
        res.writeHead(404, {'ContentType':'text/plain'});
        res.end('404, page not found');
        return;
      }
      
      var mimeType = mimeTypes[getExtension(req.url)]

      res.writeHead(200, {'ContentType':mimeType});
      res.end(data);
    });
  }
});

io = io.listen(app);

io.on('connect',function(socket) {
  socket.emit('connected');
  socket.on('draw', function(data) {
    socket.broadcast.emit('draw',data);
  });
});

app.listen(80);

console.log('Listening on port 80.');
