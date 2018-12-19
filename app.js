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

    if (!user['mod']) {
        if (message.includes("www.") || message.includes(".com")) {
            client.timeout(channel, sender, 30, "Ask before sending links");
            return;
        }
    }

    if (message.toLowerCase().includes("hi") || message.toLowerCase().includes("hello") || message.toLowerCase().includes("sup")) {
        client.action("TheBorgLIVE", "Hello " + user['display-name']);
        return;
    }
});

client.on("subscription", function (channel, username, method, message, userstate) {
    client.action("TheBorgLIVE", "Thank you, " + username + "for subscribing!")
});

