var http = require('http');
var fs = require('fs');

var publicDir = '/public';

http.createServer(function(req, res) {
  if(req.url || req.url == '/') {
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
      
      res.writeHead(200, {'ContentType':'text/html'});
      res.end(data);
    });
  }
}).listen(80);
