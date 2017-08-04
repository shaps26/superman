var socket = io.connect('http://172.16.32.142:8080' , {query: 'token='+localStorage.getItem("serverToken")});

socket.on('unixVersion', function(data) {
	$("#unixVersion").html(data);
});

socket.on('serverInfo', function(data) {
	$("#serverInfo").html(data);
});

socket.on('serverProcessus', function(data) {
	$("#serverProcessus").html(data);
});





