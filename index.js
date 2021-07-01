var express = require('express');
var app = express();
var server = require('https').createServer(app);

var totalConnections = 0;

function addConnections(n) {
  totalConnections += n;
}

var io = require('socket.io')(server,{
  cors: {
    origin: ["http://localhost:3001", "http://st-react.oscarcatarigutierrez.com"],
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
