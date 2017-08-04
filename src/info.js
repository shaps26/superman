var exec = require('exec');

function InfoSystem(socketClient){
	this.socketClient= socketClient;
};

InfoSystem.checkUserPassword= function(username, password, callback){
	exec([__dirname+'/../bash/password.bash', username, password], function(err, out, code) {
		if (err instanceof Error){
 			console.log(err);
  			throw err;
  		}
  		callback(out);
  	});
  }
  


InfoSystem.prototype.sendUnixVersion = function(){
	var client = this.socketClient;
	exec(['uname', '-a'], function(err, out, code) {
		if (err instanceof Error)
			throw err;
		client.emit("unixVersion", out);
	});
}


InfoSystem.prototype.sendServerInfo = function(){
	var client = this.socketClient;
	exec(['top', '-b', '-d1', '-n1'], function(err, out, code) {
		if (err instanceof Error)
			throw err;
		var result = out.replace(new RegExp("\n", 'g'), "<br/>\n");
		var resultServerInfo= result.substr(0, result.indexOf( "<br/>\n<br/>\n"));
		var resultServerProcessus= result.substr(result.indexOf( "<br/>\n<br/>\n")+14, result.length);
		resultServerProcessus= "<table class='striped'><tr><td>"
								+resultServerProcessus.replace(new RegExp(" ", 'g'), "</td><td>")
													  .replace(new RegExp("\n", 'g'), "</td></tr>\n<tr><td>")
								+"</td></tr></table>";
		resultServerProcessus= resultServerProcessus.replace(new RegExp("<td></td>", 'g'), "");
		client.emit("serverInfo", resultServerInfo);
		client.emit("serverProcessus", resultServerProcessus);
	});
	var infoSys = this;
	setTimeout(function(){
		infoSys.sendServerInfo();
	},1000);

}

module.exports =  InfoSystem;