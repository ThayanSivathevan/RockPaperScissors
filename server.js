var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server); 

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
	console.log('Starting server on port 5000');
});

var counter = 0;
var player = {};
var pNum = {};
var created=false;

io.on('connection', function(socket) {
	if (counter < 2) {
		socket.on('new player', function() {
			player[socket.id] = {
				choice: 0,
				wins: 0,
				losses: 0,
				ties: 0,
				submit: false,
				won:false,
				tied:false,
				lost:false
			};
			pNum[counter] = socket.id;
			io.sockets.emit('message', pNum[counter]);
			console.log(pNum[0]+" "+pNum[1]);
			console.log(pNum[counter]);
			console.log(pNum[counter]+" "+counter);
			counter++;
			if(counter==2)created = true;
		});
		console.log('Player connected!', socket.id);
	}

	socket.on('disconnect', () => {
			if(player[socket.id]!=null){
				delete player[socket.id];
				console.log('Player disconnected!', socket.id);
				if(pNum[0]==socket.id&&pNum[1]!=null){
					pNum[0]=pNum[1];
				}
				counter--;
				console.log(pNum[0]+" "+pNum[1]);
				created=false;
			}
	});

	socket.on('pressed', function(data, submit) {
		var play = player[socket.id] || {};
		var n=socket.id
		play.submit=true;
		console.log(play.submit);
		if(data.rock){
			play.choice=1;
		}
		if(data.paper){
			play.choice=2;
		}
		if(data.scissors){
			play.choice=3;
		}
		checkResult();
	});

	setInterval(function() {
		io.sockets.emit('draw');
	}, 1000 / 60);


function checkResult() {
	console.log(pNum[0]+" "+pNum[1]);
	console.log(pNum[0]!=null&&pNum[1]!=null);
	if (pNum[0]!=null&&pNum[1]!=null) {
		console.log(pNum[0]+" "+pNum[1]);
		if (player[pNum[0]].submit && player[pNum[1]].submit) {
				player[pNum[0]].tied=false;
				player[pNum[1]].tied=false;
				player[pNum[0]].won=false;
				player[pNum[1]].won=false;
				player[pNum[0]].lost=false;
				player[pNum[1]].lost=false;
			if (player[pNum[0]].choice == player[pNum[1]].choice) {
				player[pNum[0]].ties++;
				player[pNum[1]].ties++;
				player[pNum[0]].tied=true;
				player[pNum[1]].tied=true;
			} else if ((player[pNum[0]].choice == 1 && player[pNum[1]].choice == 3) || (player[pNum[0]].choice ==2 && player[pNum[1]].choice == 1) || (player[pNum[0]].choice == 3 && player[pNum[1]].choice == 2)) {
				player[pNum[0]].wins++;
				player[pNum[1]].losses++;
				player[pNum[0]].won=true;
				player[pNum[1]].lost=true;
			} else {
				player[pNum[1]].wins++;
				player[pNum[0]].losses++;
				player[pNum[1]].won=true;
				player[pNum[0]].lost=true;
			}
			player[pNum[1]].submit = false;
			player[pNum[0]].submit = false;
			io.sockets.emit('player', player);
		}
	}
}



});