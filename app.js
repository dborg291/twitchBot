const botInfo = require("./botInfo");
const tmi = require("tmi.js");
const axios = require("axios");
const request = require('request');
var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
	clientId: botInfo.spotifyClientID,
	clientSecret: botInfo.spotifyClientSecret,
	redirectUri: botInfo.spotifyRedirectURI
  });

const options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: botInfo.username,
        password: botInfo.password
    },
    channels: ["#" + botInfo.channel]
};

const client = new tmi.client(options);

var permitArray = [];
var pollMap = new Map();
var randomMessage;

// Connect the client to the server..
client.connect();
client.on("connected", function (address, port) {
    client.action(botInfo.channel, "Hello Chat! I'm here and moderating over you!");
    randomMessage = setInterval(randomCommand, 1800000); //call the randomCommand function every 30 min
    // playCommerial = setInterval(runCommerical, 1800000); //runs a commerical every 30 min
});

client.on("chat", function (channel, user, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    //console.log(user);
    console.log("Message: " + message)
    let sender = user['display-name'];



    //STREAMER ONLY COMMANDS
    if (channel.includes(user.username)) {
        console.log("Chat is from the streamer");

        if (message == "!leave") {
            client.action(channel, "It is time for me leave, please behave yourself in chat.");
            clearInterval(randomMessage); //stop sending a message every 10 min
            // clearInterval(playCommerial); //stop sending a play commerial command every 30 min
            client.disconnect(); //leave from the chat
            return;
        }
    }

    //MOD ONLY COMMANDS
    if (user['mod'] == true || channel.includes(user.username)) {
        console.log("Chat is from a mod");

        if (message.toLowerCase().includes("!follow")) {
            client.action(botInfo.channel, "Please be sure to follow the stream so you can be notified when I go live next! It really helps the channel grow and build a great community.");
            return;
        }

        if (message.toLowerCase().includes("!twitchprime")) {
            client.action(botInfo.channel, "If you wish to give back to the stream and you have Amazon Prime, you can get one free Twitch Prime subscription a month. You can subscribe by clicking above the stream or by clicking https://www.twitch.tv/products/theborgLIVE/ticket/new");
            return;
        }

        if(message.toLowerCase().includes("!permit")){ //Allows chaters to send one link
            var atIndex = message.indexOf(" ");  //Mods/Streamer must @ the user they want to permit so its correct
            var permitedUser = message.substring(atIndex+1); //find the start of the user's name
            permitArray.push(permitedUser); //add the permited user to the array
            console.log(permitArray); 
            client.action(botInfo.channel, "@" + permitedUser + " you are allowed to post one link.");
            return;
        }

        if(message.toLowerCase().includes("!so")){
            var atIndex = message.indexOf("@");
            var shoutoutUser = message.substring(atIndex+1);
            client.action(botInfo.channel, "Everyone give " + shoutoutUser + " a follow at http://www.Twitch.tv/" + shoutoutUser + " They are a beast!");
            return;
        }

        if(message.toLowerCase().includes("!poll")){
            var startQuestionIndex = message.indexOf(" "); //find the start of the poll question
            var endQuestionIndex = message.indexOf("|"); //find the end of the question
            var pollQuestion = message.substring(startQuestionIndex+1, endQuestionIndex).trim(); //store the qestiona and trim the spaces at the start and the end
            var pollChat = pollQuestion; //add the question to the message that will be sent in chat in the end
            console.log("Poll Question: " + pollQuestion);
            var pollOptions = message.substring(endQuestionIndex+1); // find the options that can be chosen for the poll
            console.log("Poll Options: " + pollOptions);

            var reachedEnd = false;
            while(!reachedEnd){
                if(pollOptions.indexOf("|") >= 0) //if the last answer has not been reached
                {
                    var option = pollOptions.substring(0, pollOptions.indexOf("|")).trim(); //find the option and trim the spaces in the start and the end
                    pollMap.set(option, 0); //add the option to map
                    console.log(pollMap.keys());
                    pollOptions = pollOptions.substring(pollOptions.indexOf("|")+1); //update pollOptions to not include the option that was just added to the map
                }else{ //at the last option
                    pollMap.set(pollOptions.trim(), 0); //add the rest of the pollOptions to the map
                    console.log(pollMap.keys()); 
                    reachedEnd = true; //set reachedEnd to end the while loop
                }
            }
            var currentIndex = 0;
                var pollLength = Array.from(pollMap.keys()).length - 1; //find the number of keys in the map
                for(var i = 0 ; i <= pollLength; i++){
                    var currentIndex = i; 
                    pollChat = pollChat + " " + (currentIndex+1) + ") " + Array.from(pollMap.keys())[i]; //add each option to the chat that will be sent
                }
            client.action(botInfo.channel, pollChat);
            return;
        }
    }

    //NON-MOD COMMANDS
    if (!user['mod']) {
        console.log("Chat is not from a mod");
        if (message.includes("www.") || message.includes(".com") || message.includes(".net") || message.includes(".org") || message.includes(".edu") || message.includes(".info") || message.includes(".gov") || message.includes(".mil") || message.includes(".biz")) { //chat must be a link
            if(permitArray.indexOf(sender) != -1){ //check if the user has bene permited
                permitArray = arrayRemove(permitArray, sender); //remove the user from the permited array
                console.log(permitArray);
            client.action(botInfo.channel, "@" + sender + " you used your one link."); 
            return;
            }else{ //user has not been permited
            client.timeout(channel, sender, 30, "Ask before sending links"); //timeout the user
            return;
            }
        }
    }

    //EVERYONE
    if (message.toLowerCase().includes("hi ") || message.toLowerCase().includes("hello ") || message.toLowerCase().includes("sup ") || message.toLowerCase().includes("hey ") || message.toLowerCase().includes("whats up ")) {
        client.action(botInfo.channel, "Hello " + user['display-name']);
        return;
    }

    if (message.toLowerCase().includes("!discord")) {
        client.action(botInfo.channel, "If you want to join my Discord, here is the link! " + botInfo.discordLink);
        return;
    }

    if (message.toLowerCase().includes("good bot")) {
        client.action(botInfo.channel, "Thanks for the complement " + user['display-name'] + "!");
        return;
    }

    if(message.toLowerCase().includes("!loot")){
        client.action(botInfo.channel, "Loots is way to send a donation like request that it completely free. After a short ad is shown on the top right, your message will apear. This is way to make sure I see your message as well supporting the stream. To send a messgae go to: https://loots.com/theborglive")
        return;
    }

    if(message.toLowerCase().includes("!commands")){
        client.action(botInfo.channel, "!follow    !twitchprime    !discord    !loot    !uptime    !permit  !so    !leave    NOTE:  Some commands can only be used a mod or the streamer.")
        return;
    }

    if (message.includes('!song')) {
        request({url: botInfo.spoiftyAPILink, json: true}, function(err, res, json) {
            if (err) {
                throw err;
            }else{
                let song = json.toString();
                console.log("SONG = " + song)

                if(song.includes('Not playing or private session.')){
                client.action(botInfo.channel,"No song is currently being played.");
                return;
                }

                let artist = song.substring(2, song.indexOf('-'))
                console.log("ARTIST = " + artist)
                let songName = song.substring(song.indexOf('"') + 1, song.lastIndexOf('"'))
                console.log('SONG NAME = ' + songName)
                client.action(botInfo.channel,"Current Song: " + songName + " by " + artist);
                return;
            }
        });
    }

    if (message.toLowerCase() == "!uptime") {

        axios.get("https://api.twitch.tv/kraken/streams/theborgLIVE?client_id=" + botInfo.clientID).then((response) => {
            if (response.data.stream == null) {
                console.log("Steam is offline");
                client.action(botInfo.channel, botInfo.channel + " is not currently streaming!");
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

            console.log('UPTIME: ' + hoursDifference + ' hours ' + minutesDifference + ' minutes ' + secondsDifference + ' seconds ');

            client.action(botInfo.channel, botInfo.channel + " has been streaming for " + hoursDifference + ' hours ' + minutesDifference + ' minutes ' + secondsDifference + ' seconds!');
        });

        return;
    }
});

client.on("hosting", function (channel, target, viewers) {
    client.action(botInfo.channel, "Thank you, " + channel + " for hosting for " + viewers + " viewers!");
    return;
});

client.on("subscription", function (channel, username, method, message, userstate) {
    client.action(botInfo.channel, "Thank you, " + userstate['display-name'] + "for subscribing!");
    return;
});

client.on("follow", function (channel, username, method, message, userstate) {
    client.action(botInfo.channel, "Thank you, " + userstate['display-name'] + "for following!");
    return;
});

client.on("resub", function (channel, username, months, message, userstate, methods) {
    client.action(botInfo.channel, userstate['display-name'] + "has resubscribed for " + months + "months!");
    return;
});

//removes the element from the array
function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });
 
}

//send a random message to the chat
function randomCommand(){
    var random = Math.floor(Math.random() * 3) + 1; // returns a random integer from 1 to 10
    if(random == 1){ //follow
        client.action(botInfo.channel, "Please be sure to follow the stream so you can be notified when I go live next! It really helps the channel grow and build a great community.");
    }else if(random == 2){ //discord
        client.action(botInfo.channel, "If you want to join my Discord, here is the link! " + botInfo.discordLink);
    }else if(random == 3){ //loot
        client.action(botInfo.channel, "Loots is way to send a donation like request that it completely free. After a short ad is shown on the top right, your message will apear. This is way to make sure I see your message as well supporting the stream. To send a messgae go to: https://loots.com/theborglive")
    }
    return;
}

function runCommerical(){
    client.say(botInfo.channel, "/commercial");
    return;
}