var jwt = require("jsonwebtoken");
var jwtSecret= "maphrasesecrete";

var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var socketIoJWT = require("socketio-jwt");
var infosystem = require("./src/info");

app.use(session({secret: jwtSecret}));
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));

app.get('/login', function(req, res, next) {  
    res.sendFile(__dirname + '/public/login.html');
});

 app.post('/login', function(req, res){
 	console.log("try connect "+req.body.username);
  	infosystem.checkUserPassword(req.body.username, req.body.password, function(result){
  		console.log(result);
 		if(result.trim()=="ok"){
  			var token= jwt.sign({'username'	: req.body.username}, jwtSecret, {expiresIn : '1h'});
  			req.session.serverToken= token;
  			res.json({'token': token});
		}else{
			res.sendStatus(401);
		}
	});
});

app.get('/', function(req, res,next) {
	if(!checkedToken(req.session.serverToken)){
		res.redirect("/login");
		return;
	}
    res.sendFile(__dirname + '/public/home.html');
});

server.listen(8080, function(){
	console.log("listenning on port 8080");
	
}); 

io.set('authorization', socketIoJWT.authorize({
	secret: jwtSecret,
	handshake: true
}));

io.sockets.on('connection', function(socket){
	var decoded = checkedToken(socket.handshake.query.token);
	if(decoded){
		console.log(decoded.username+" connected");
		var info= new infosystem(socket);
		info.sendUnixVersion();
		info.sendServerInfo();
	}
	socket.on('disconnect', function(){
		console.log(decoded.username+" connected");
	});
});

function checkedToken(token){
	if(!token)return false;
	try{
		var decoded = jwt.verify(token, jwtSecret);
		return decoded;
	}catch(err){
		return false;
	}
}