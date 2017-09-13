//Required Discord constants
const Discord = require("discord.js");
const TOKEN = "FAKETOKENREPLACEFORYOUROWNBOT";
const PREFIX = "!";
const YTDL = require("ytdl-core");


var bot = new Discord.Client();

//Allows for music to be queued for individual servers rather than a global queue
var servers = {};

var fortunes = [
	"Yes",
	"No",
	"Maybe",
	"Seems unlikely",
	"Ask again later",
	"Please don't bother me",
];

var coin = ["Heads", "Tails"];

//Confirms to console that the bot is active
bot.on("ready", function() {
  console.log("Ready");
});

bot.on("message", function(message) {
  if (message.author.equals(bot.user)) return;

  if (!message.content.startsWith(PREFIX)) return;

  var args = message.content.substring(PREFIX.length).split(" ");

  switch (args[0].toLowerCase()) {
    case "ping":
		message.reply("Pong!");
		break;
	case "fortune":
		if(args[args.length- 1].endsWith("?"))message.reply(fortunes[Math.floor(Math.random()*fortunes.length)]);
		else message.reply("Please ask me a question");
		break;
	case "coinflip":
		message.reply(coin[Math.floor(Math.random()*2)]);
	    break;
	case "roll":
		messageString = message.toString();
		var parsed = messageString.split(/['d'\s]/);
		var numDice = parsed[1];
		var numSides = parsed[2];
		
		var rolls = [];
		
		if (numDice == 0 || numSides == 0){
			message.reply("Needs to be a value greater than 0!");
			break;
		}
		
		for (i=0 ; i<numDice; i++){
			var total = rollDice(numSides);
			rolls.push(total);
		}
		
		var rollString = rolls.join(' + ');
		var sum = rolls.reduce(function(sum, b) { return sum + b; }, 0);
		
		//Required otherwise message will not be posted due to message length limit
		if (rollString.length >= 2000)
			message.reply("Discord message length limit reached. Sum of rolls is : " + sum);
		else
			message.reply(rollString +'=' + sum);
		break;
		
	case "play":
		if (!args[1]){
			message.reply("Please provide a link.");
			return;
		}
		
		if (!message.member.voiceChannel){
			message.reply("You must be in a voice channel.");
			return;
		}
		
		if (!servers[message.guild.id])servers[message.guild.id] = {
			queue: []
		};
		
		var server = servers[message.guild.id];
		server.queue.push(args[1]);
		if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
				play(connection, message);
		});
		break;
	
	//Allows users to skip songs in the queue, or end the queue if at the end 
	case "skip":
		var server = servers[message.guild.id];
		if (server.dispatcher) server.dispatcher.end();
		
		break;

	default:
		message.channel.send("Invalid command!");
		break;
  }
});

function rollDice(x){
	return Math.floor(Math.random() * x + 1);
}

function play(connection, message){
	var server = servers[message.guild.id];
	//Saves bandwith by downloading only the audio from the youtube videos
	server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
	server.queue.shift();
	server.dispatcher.on("end", function(){
			if (server.queue[0]) play(connection, message);
			else{
				//Leaves server once the queue has ended
				message.channel.sendMessage("Queue is over.");
				connection.disconnect()
			};
	});
}


bot.login(TOKEN);
