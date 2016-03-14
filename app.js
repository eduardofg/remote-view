var fs = require('fs'),
    https = require('https'),
    express = require('express'),
    app = express();

var server = https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
}, app).listen(443);

console.log('Listen');

app.get('/', function (req, res) {
  return res.sendfile('index.html')
});

/* serves all the static files */
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]); 
 });

var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
    socket.on('message', function (data) {
        console.log('Data:' + data);
        socket.broadcast.emit('message', data);
    });
});

