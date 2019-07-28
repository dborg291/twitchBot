import tmi, { Client, Options, UserNoticeState } from "tmi.js";
import { Badge, ICommand } from "./ICommand";
import { Commands, CommandList } from "./commands/Commands";
import { IConfiguration } from "./IConfiguration";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import constants from "../config/constants.json";
import fs from "fs";
import request from "request";
import { CommandHelpers } from "./CommandHelpers";

const config: IConfiguration = constants;

let spotifyApi = new SpotifyWebApi({
	clientId: config.spotifyClientID,
	clientSecret: config.spotifyClientSecret,
	redirectUri: config.spotifyRedirectURI
});

const options: Options = {
	options: {
		debug: true
	},
	connection: {
		reconnect: true
	},
	identity: {
		username: config.username,
		password: config.password
	},
	channels: ["#" + config.channel]
};

const client: Client = tmi.client(options);

var permitArray: any[] = [];
var pollMap: any = new Map();
var onGoingPoll: boolean = false;
var pollEntries: number = 0.0;
var pollAnswers: any[] = [];
var currentViewers: any[] = [];
var randomMessage: any;
var welcomeMessage: boolean = false;
var loyaltyPointsJson: any;


// Connect the client to the server..
client.connect();
client.on("connected", (address: string, port: number) => {
	client.action(config.channel, "Hello Chat! I'm here and moderating over you!");
	randomMessage = setInterval(randomCommand, 1800000); //call the randomCommand function every 30 min
	// playCommerial = setInterval(runCommerical, 1800000); //runs a commerical every 30 min
	loyaltyPoints();
});

client.on("chat", (channel: string, user: UserNoticeState, message: string, self: boolean) => {
	// Don't listen to my own messages..
	if (self) return;
	//console.log(user);
	console.log("Message: " + message);
	let sender = user["display-name"];

	//STREAMER ONLY COMMANDS
	if (channel.includes(user.username)) {
		// console.log("Chat is from the streamer");

		if (message == "!leave") {
			client.action(channel, "It is time for me leave, please behave yourself in chat.");
			clearInterval(randomMessage); //stop sending a message every 10 min
			// clearInterval(playCommerial); //stop sending a play commerial command every 30 min
			client.disconnect(); //leave from the chat
			return;
		}
	}

	if (message.startsWith("!")) {
		let commandText: string = message.split(" ")[0];

		let command: ICommand | undefined = CommandList.get(commandText);
		if (command) {
			if (CommandHelpers.IsCommandAvailableToUser(command.badges, user.badges)) {
				command.action(client, config, channel, user, message, self);
			}
		} else {
			// command not found
		}
	}

	//MOD ONLY COMMANDS
	if (user["mod"] == true || channel.includes(user.username)) {
		// console.log("Chat is from a mod");

		if (message.toLowerCase().includes("!permit")) { 
			//Allows chaters to send one link
			var atIndex = message.indexOf(" "); //Mods/Streamer must @ the user they want to permit so its correct
			var permitedUser = message.substring(atIndex + 1); //find the start of the user's name
			permitArray.push(permitedUser); //add the permited user to the array
			console.log(permitArray);
			client.action(config.channel, "@" + permitedUser + " you are allowed to post one link.");
			return;
		}

		if (message.toLowerCase().includes("!so")) {
			var atIndex = message.indexOf("@");
			var shoutoutUser = message.substring(atIndex + 1);
			client.action(config.channel, "Everyone give " + shoutoutUser + " a follow at http://www.Twitch.tv/" + shoutoutUser + " They are a beast!");
			return;
		}

		if (message.toLowerCase().includes("!poll")) {
			onGoingPoll = true;
			var startQuestionIndex = message.indexOf(" "); //find the start of the poll question
			var endQuestionIndex = message.indexOf("|"); //find the end of the question
			var pollQuestion = message.substring(startQuestionIndex + 1, endQuestionIndex).trim(); //store the qestiona and trim the spaces at the start and the end
			var pollChat = pollQuestion; //add the question to the message that will be sent in chat in the end
			console.log("Poll Question: " + pollQuestion);
			var pollOptions = message.substring(endQuestionIndex + 1); // find the options that can be chosen for the poll
			console.log("Poll Options: " + pollOptions);

			var reachedEnd = false;
			while (!reachedEnd) {
				if (pollOptions.indexOf("|") >= 0) {
					//if the last answer has not been reached
					var option = pollOptions.substring(0, pollOptions.indexOf("|")).trim(); //find the option and trim the spaces in the start and the end
					pollMap.set(option, 0); //add the option to map
					console.log(pollMap.keys());
					pollOptions = pollOptions.substring(pollOptions.indexOf("|") + 1); //update pollOptions to not include the option that was just added to the map
				} else {
					//at the last option
					pollMap.set(pollOptions.trim(), 0); //add the rest of the pollOptions to the map
					console.log(pollMap.keys());
					reachedEnd = true; //set reachedEnd to end the while loop
				}
			}
			var currentIndex = 0;
			var pollLength = Array.from(pollMap.keys()).length - 1; //find the number of keys in the map
			for (var i = 0; i <= pollLength; i++) {
				currentIndex = i;
				pollChat = pollChat + " " + (currentIndex + 1) + ") " + Array.from(pollMap.keys())[i]; //add each option to the chat that will be sent
			}
			client.action(config.channel, pollChat);
			return;
		}

		if (message.toLowerCase().includes("!closepoll")) {
			if (onGoingPoll == true) {
				onGoingPoll = false;
				var pollMessage = "";
				for (var j = 0; j <= Array.from(pollMap.keys()).length - 1; j++) {
					pollMessage =
						pollMessage +
						Array.from(pollMap.keys())[j] +
						") " +
						(parseFloat(pollMap.get(Array.from(pollMap.keys())[j])) / pollEntries) * 100 +
						"% ";
				}
				client.action(config.channel, "The current poll is now closed.");
				client.action(config.channel, "Total number of poll votes: " + pollEntries);
				client.action(config.channel, pollMessage);

				pollMap.clear();
				pollEntries = 0;
				let pollAnswers = [];
			}

			return;
		}

		if (message.toLowerCase().includes("!togglewelcome")) {
			welcomeMessage = !welcomeMessage;
			client.action(config.channel, "Welcome message is now set to: " + welcomeMessage);
		}
	}

	//NON-MOD COMMANDS
	if (!user["mod"]) {
		// console.log("Chat is not from a mod");
		if (
			message.includes("www.") ||
			message.includes(".com") ||
			message.includes(".net") ||
			message.includes(".org") ||
			message.includes(".edu") ||
			message.includes(".info") ||
			message.includes(".gov") ||
			message.includes(".mil") ||
			message.includes(".biz")
		) {
			//chat must be a link
			if (permitArray.includes(sender)) {
				//check if the user has bene permited
				permitArray = arrayRemove(permitArray, sender); //remove the user from the permited array
				console.log(permitArray);
				client.action(config.channel, "@" + sender + " you used your one link.");
				return;
			} else {
				//user has not been permited
				client.timeout(channel, sender || "", 30, "Ask before sending links"); //timeout the user
				return;
			}
		}
	}

	//EVERYONE
	if (
		(message.toLowerCase().includes("hi") ||
			message.toLowerCase().includes("hello") ||
			message.toLowerCase().includes("sup") ||
			message.toLowerCase().includes("hey") ||
			message.toLowerCase().includes("whats up")) &&
		!message.toLowerCase().includes("they")
	) {
		// client.action(botInfo.channel, "Hello " + user['display-name']); //commented out since this is causing too many false postives, swtiched to using the join event for welcoming a user
		return;
	}

	if (message.toLowerCase().includes("good bot")) {
		client.action(config.channel, "Thanks for the complement " + user["display-name"] + "!");
		return;
	}

	if (message.toLowerCase().includes("!answer")) {
		if (onGoingPoll == true) {
			console.log(pollAnswers.includes(user["username"]));
			if (!pollAnswers.includes(user["username"])) {
				var answer = parseInt(message.substring(message.indexOf(" ") + 1), 10);
				var mapKey = Array.from(pollMap.keys())[answer - 1];
				console.log(pollMap);
				console.log("POLL ANSWER : " + answer);
				console.log("KEY: " + mapKey);
				if (pollMap.has(mapKey)) {
					pollMap.set(mapKey, pollMap.get(mapKey) + 1);
					pollEntries = pollEntries + 1;
					pollAnswers.push(user["username"]);
					console.log(pollAnswers);
					console.log("POLL ENTIRES: " + pollEntries);
				} else {
					client.say(config.channel, "/w " + user["username"] + " Your did not send a valid poll response.");
				}
				console.log(pollMap);
			} else {
				client.say(config.channel, "/w " + user["username"] + " You have already answered the current poll.");
			}
		} else {
			client.say(config.channel, "/w " + user["username"] + " There currently is not an active poll.");
		}

		return;
	}

	if (message.includes("!song")) {
		request({ url: config.spoiftyAPILink, json: true }, function(err, res, json) {
			if (err) {
				throw err;
			} else {
				let song = json.toString();
				console.log("SONG = " + song);

				if (song.includes("Not playing or private session.")) {
					client.action(config.channel, "No song is currently being played.");
					return;
				}

				let artist = song.substring(2, song.indexOf("-"));
				console.log("ARTIST = " + artist);
				let songName = song.substring(song.indexOf('"') + 1, song.lastIndexOf('"'));
				console.log("SONG NAME = " + songName);
				client.action(config.channel, "Current Song: " + songName + " by " + artist);
				return;
			}
		});
	}

	if (message.toLowerCase() == "!uptime") {
		axios.get("https://api.twitch.tv/kraken/streams/theborgLIVE?client_id=" + config.clientID).then(response => {
			if (response.data.stream == null) {
				console.log("Steam is offline");
				client.action(config.channel, config.channel + " is not currently streaming!");
				return;
			}

			const now = new Date();
			const utc_timestamp = now;

			const streamTime = new Date(response.data.stream.created_at);

			console.log("STREAM STARTED: " + streamTime);
			console.log("TIME NOW: " + utc_timestamp);

			var difference = utc_timestamp.getTime() - streamTime.getTime();

			var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
			difference -= hoursDifference * 1000 * 60 * 60;

			var minutesDifference = Math.floor(difference / 1000 / 60);
			difference -= minutesDifference * 1000 * 60;

			var secondsDifference = Math.floor(difference / 1000);

			console.log("UPTIME: " + hoursDifference + " hours " + minutesDifference + " minutes " + secondsDifference + " seconds ");

			client.action(
				config.channel,
				config.channel + " has been streaming for " + hoursDifference + " hours " + minutesDifference + " minutes " + secondsDifference + " seconds!"
			);
		});

		return;
	}
});

client.on("hosting", function(channel: string, target: string, viewers: number) {
	client.action(config.channel, "Thank you, " + channel + " for hosting for " + viewers + " viewers!");
	return;
});

client.on("subscription", function(channel, username, method, message, userstate) {
	client.action(config.channel, "Thank you, " + userstate["display-name"] + "for subscribing!");
	return;
});

// client.on("followersonly", function (channel, username, method, message, userstate) {
//     client.action(config.channel, "Thank you, " + userstate['display-name'] + "for following!");
//     return;
// });

client.on("resub", function(channel, username, months, message, userstate, methods) {
	client.action(config.channel, userstate["display-name"] + "has resubscribed for " + months + "months!");
	return;
});

client.on("join", (channel, username, self) => {
	if (welcomeMessage == true) {
		client.action(config.channel, "Welcome to the channel " + username);
	} else {
		console.log("Welcome message is set to false, therefore did not welcome: " + username);
	}
	return;
});

//removes the element from the array
function arrayRemove(arr: any[], value: string | undefined) {
	return arr.filter(function(ele) {
		return ele != value;
	});
}

//send a random message to the chat
function randomCommand() {
	var random = Math.floor(Math.random() * 3) + 1; // returns a random integer from 1 to 10
	if (random == 1) {
		//follow
		client.action(
			config.channel,
			"Please be sure to follow the stream so you can be notified when I go live next! It really helps the channel grow and build a great community."
		);
	} else if (random == 2) {
		//discord
		client.action(config.channel, "If you want to join my Discord, here is the link! " + config.discordLink);
	} else if (random == 3) {
		//loot
		client.action(
			config.channel,
			"Loots is way to send a donation like request that it completely free. After a short ad is shown on the top right, your message will apear. This is way to make sure I see your message as well supporting the stream. To send a messgae go to: https://loots.com/theborglive"
		);
	}
	return;
}

function runCommerical() {
	client.say(config.channel, "/commercial");
	return;
}

function loyaltyPoints() {
	const url = config.loyaltyPointURL;
	axios.get(url).then(response => {
		for (let i = 0; i < response.data.chatters.broadcaster.length; i++) {
			currentViewers.push(response.data.chatters.broadcaster[i]);
		}
		for (let i = 0; i < response.data.chatters.moderators.length; i++) {
			currentViewers.push(response.data.chatters.moderators[i]);
		}

		for (let i = 0; i < response.data.chatters.vips.length; i++) {
			currentViewers.push(response.data.chatters.vips[i]);
		}

		for (let i = 0; i < response.data.chatters.staff.length; i++) {
			currentViewers.push(response.data.chatters.staff[i]);
		}

		for (let i = 0; i < response.data.chatters.admins.length; i++) {
			currentViewers.push(response.data.chatters.admins[i]);
		}

		for (let i = 0; i < response.data.chatters.global_mods.length; i++) {
			currentViewers.push(response.data.chatters.global_mods[i]);
		}

		for (let i = 0; i < response.data.chatters.viewers.length; i++) {
			currentViewers.push(response.data.chatters.viewers[i]);
		}

		fs.stat("./config/loyaltypoints.json", (exists) => {
        	if (exists == null) {
				var data = fs.readFileSync("./config/loyaltypoints.json",'utf8');
				loyaltyPointsJson = JSON.parse(data);
            } else if (exists.code === 'ENOENT') {
				fs.writeFileSync('./config/loyaltypoints.json','[{"id":"theborglive","points":1},{"id":"theborglivebot","points":1}]');
				var data = fs.readFileSync("./config/loyaltypoints.json",'utf8');
				loyaltyPointsJson = JSON.parse(data);
			}
			
			for(var i = 0; i < currentViewers.length; i++)
			{
				if(loyaltyPointsJson[i].id === currentViewers[i]){
					var currentPoints = loyaltyPointsJson[i].points;
					loyaltyPointsJson[i].points = currentPoints + 1;
				}else{
					loyaltyPointsJson.push({
						"id":currentViewers[i],
						"points":1,
					});
				}
			}
			fs.writeFileSync('./config/loyaltypoints.json', JSON.stringify(loyaltyPointsJson))	
		});
	});
	console.log("Updated current loyalty points!");
	return;
}
