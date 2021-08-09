var express = require('express');
var app = express();
var server = require('http').createServer(app);

var totalConnections = 0;

function addConnections(n) {
  totalConnections += n;
}

var io = require('socket.io')(server,{
  cors: {
    origin: ["http://localhost:3001", 
      "http://st-react.oscarcatarigutierrez.com", 
      "https://st-react.oscarcatarigutierrez.com",
      "http://simple-twitch.oscarcatarigutierrez.com",
      "https://simple-twitch.oscarcatarigutierrez.com"
    ],
    methods: ["GET", "POST"],
	  credentials: true
  }
});
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.io = io;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.get('/', function(req, res){
    console.log('st-node');
    //io.emit('root', null);
    res.send('st-node');
});


app.get('/test', function(req, res){
    console.log("test");
    io.emit('test', null);

    res.send('test');
});

app.post('/new-message', function(req, res){
  console.log("newMessage");
  io.emit('newMessage', req.body);
  res.send('new-message');
});
  
io.on('connection', (socket) => {
    addConnections(1);
    console.log("Connection " + totalConnections);

    io.emit('totalConnections', totalConnections);

    socket.on('disconnect', () => {
        addConnections(-1);
        console.log("Disconnection " + totalConnections);
        io.emit('totalConnections', totalConnections);
    });

});
