var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var exec = require('exec');

app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

server.listen(8080, function(){
	console.log("listenning on port 8080");
	
}); 

io.on('connection', function(client) {  
	console.log('Client connected...');
	client.on('join', function(data) {
		console.log(data);
		
		exec(['uname', '-a'], function(err, out, code) {
			if (err instanceof Error)
				throw err;
			client.emit("serverInfo", out);
		});
		
	});
});