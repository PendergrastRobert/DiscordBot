const Discord = require("discord.js");
const TOKEN = "THIS_IS_A_FAKE_TOKEN";
const PREFIX = "!";

var bot = new Discord.Client();

var fortunes = [
	"Yes",
	"No",
	"Maybe",
	"Seems unlikely",
	"Ask again later",
	"Please don't bother me",
];

var coin = ["Heads", "Tails"];


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
		
		if (rollString.length >= 2000)
			message.reply("Discord message length limit reached. Sum of rolls is : " + sum);
		else
			message.reply(rollString +'=' + sum);
		break;
	default:
		message.channel.send("Invalid command!");
		break;
  }
});

function rollDice(x){
	return Math.floor(Math.random() * x + 1);
}

bot.login(TOKEN);
