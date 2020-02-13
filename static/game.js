var socket = io();

const inc=12;
var buttonX = 100;
var buttonY1 = 100;
var bWidth = 100;
var bHeight = 100;
var buttonY2 = 300;
var buttonY3 = 500;

const fill=10;
var buttonXS=450;
var buttonYS =300;

var info;
var submit=false;

var wins = 0;
var losses = 0;
var ties = 0;

var won=false;
var lost=false;
var tied=false;

var rock = document.getElementById("rock");
var paper = document.getElementById("paper");
var scissors = document.getElementById("scissors");
var submitBtn = document.getElementById("submit");

var pressed={
	rock:false,
	paper:false,
	scissors:false,
	clicked:false

}

document.addEventListener('mousedown', function(event) {
	var x=event.x-inc;
	var y=event.y-inc;
	console.log(x + " " + y);
	if(!submit){
		if (x >= buttonX && x <= buttonX + bWidth && y >= buttonY1 && y <= buttonY1 + bHeight) {
			pressed.rock=true;
			pressed.paper=false
			pressed.scissors=false;
			pressed.clicked=true;
			console.log('You selected Rock');
		
		}
		else if (x >= buttonX && x <= buttonX + bWidth && y >= buttonY2 && y <= buttonY2 + bHeight) {
			pressed.rock=false;
			pressed.paper=true
			pressed.scissors=false;
			pressed.clicked=true;
			console.log('You selected PAPER');

		}
		else if (x >= buttonX && x <= buttonX + bWidth && y >= buttonY3 && y <= buttonY3 + bHeight) {
			pressed.rock=false;
			pressed.paper=false
			pressed.scissors=true;
			pressed.clicked=true;
			console.log('You selected SCISSORS');
		}
	  	if((x >= buttonXS && x <= buttonXS + bWidth && y >= buttonYS && y <= buttonYS + bHeight) && pressed.clicked){
			submit=true;
			socket.emit('pressed',pressed);
			console.log('true');
		}
	}

});

socket.emit('new player');

socket.on('message', function(data) {
	if (info == null) {
		info = data;
	}
	console.log(info);
});

socket.on('player', function(players) {
	var player = players[info];
	wins = player.wins;
	losses = player.losses;
	ties = player.ties;
	won=player.won;
	lost=player.lost;
	tied=player.tied;
	submit=player.submit;

});

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 700;
var context = canvas.getContext('2d');

socket.on('draw', function() {
	context.font = "20px Arial";
	context.clearRect(0, 0, 800, 700);
	context.fillStyle = 'black';
	context.fillText("WINS: " + wins, 50, 30);
	context.fillText("LOSSES: " + losses, 50, 55);
	context.fillText("TIES: " + ties, 50, 80);


	context.fillStyle = 'green';
	if(pressed.rock)context.fillStyle = 'red';
	context.fillRect(buttonX-fill, buttonY1-fill, bWidth+fill*2, bHeight+fill*2);
	context.fillStyle = 'green';
	if(pressed.paper)context.fillStyle = 'red';
	context.fillRect(buttonX-fill, buttonY2-fill, bWidth+fill*2, bHeight+fill*2);
	context.fillStyle = 'green';
	if(pressed.scissors)context.fillStyle = 'red';
	context.fillRect(buttonX-fill, buttonY3-fill, bWidth+fill*2, bHeight+fill*2);


	context.drawImage(rock, buttonX, buttonY1, bWidth, bHeight);
	context.drawImage(paper, buttonX, buttonY2, bWidth, bHeight);
	context.drawImage(scissors, buttonX, buttonY3, bWidth, bHeight);


	context.fillStyle = 'green';
	context.fillRect(buttonXS, buttonYS, bWidth, bHeight);
	if(submit){
		context.fillText("Waiting for other player",450,50);
	}
	else context.fillText("Waiting for your move",450,50);

	if(won)context.fillText("You won last game",450,100);
	else if(tied)context.fillText("You tied last game",450,100);
	else if(lost)context.fillText("You lost last game",450,100);
});
