const botInfo = require("./botInfo");
const tmi = require("tmi.js");


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
    channels: ["#TheBorgLIVE"]
};

const client = new tmi.client(options);

$.ajax({
    url: "https://api.twitch.tv/kraken/streams/TheBorgLIVE",
    dataType: 'json',
    headers: {
        'Client-ID': your_client_id
    }
    success: function (channel) {
        if (channel["stream"] == null) {
            alert(nickname + " is not online");
        } else {
            alert(nickname + " is online!");
        }
    }
});

// Connect the client to the server..
client.connect();
client.on("connected", function (address, port) {
    client.action("TheBorgLIVE", "Hello Chat! I'm here and moderating over you!");
});

client.on("chat", function (channel, user, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // console.log(user);
    // console.log("Message" + message)
    let sender = user['display-name'];



    //STREAMER ONLY COMMANDS
    if (channel.includes(user.username)) {
        console.log("Chat is from the streamer")

        if (message == "!leave") {
            client.action(channel, "It is time for me leave, please behave yourself in chat.");
            client.disconnect();
            return;
        }
    }

    //MOD ONLY COMMANDS
    if (user['mod'] == true || channel.includes(user.username)) {
        console.log("Chat is from a mod")

        if (message.toLowerCase().includes("!follow")) {
            client.action("TheBorgLIVE", "Please be sure to follow the stream so you can be notified when I go live next! It really helps the channel grow and build a great community.");
            return;
        }

        if (message.toLowerCase().includes("!twitchprime")) {
            client.action("TheBorgLIVE", "If you wish to give back to the stream and you have Amazon Prime, you can get one free Twitch Prime subcription a month. You can subribe bu clicking above the stream or by clicking https://www.twitch.tv/products/theborgLIVE/ticket/new");
            return;
        }
    }

    //NON-MOD COMMANDS
    if (!user['mod']) {
        console.log("Chat is not from a mod")
        if (message.includes("www.") || message.includes(".com")) {
            client.timeout(channel, sender, 30, "Ask before sending links");
            return;
        }
    }

    //EVERYONE
    if (message.toLowerCase().includes("hi") || message.toLowerCase().includes("hello") || message.toLowerCase().includes("sup")) {
        client.action("TheBorgLIVE", "Hello " + user['display-name']);
        return;
    }

});

client.on("hosting", function (channel, target, viewers) {
    client.action("TheBorgLIVE", "Thank you, " + channel + " for hosting for " + viewers + " viewers!")
});

client.on("subscription", function (channel, username, method, message, userstate) {
    client.action("TheBorgLIVE", "Thank you, " + username + "for subscribing!")
});

client.on("resub", function (channel, username, months, message, userstate, methods) {
    client.action("TheBorgLIVE", username + "has resubscribed for " + months + "months!")
})

