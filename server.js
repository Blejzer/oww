var express = require('express')
var app = express();

// var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/bootstrap', express.static('bootstrap'));
app.use('/js', express.static('js'));
app.use('/images', express.static('images'));
app.use('/application', express.static('application'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
