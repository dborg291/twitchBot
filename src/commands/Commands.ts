import { IChatCommand, Badge } from "../IChatCommand";
import { Client } from "tmi.js";
import { IConfiguration } from "../IConfiguration";
import { userInfo } from "os";

const HelloCommand: IChatCommand = {
	key: "!hello",
	badge: Badge.broadcaster,
	action: (client: Client, config: IConfiguration) => {
		client.action(config.channel, "Hello!");
	}
};

const DiscordCommand: IChatCommand = {
	key: "!discord",
	badge: Badge.broadcaster,
	action: (client: Client, config: IConfiguration) => {
		client.action(config.channel, "If you want to join my Discord, here is the link! " + config.discordLink);
	}
}

const LootsCommand: IChatCommand = {
	key: "!loots",
	badge: Badge.broadcaster,
	action: (client: Client, config: IConfiguration) => {
		client.action(
			config.channel,
			"Loots is way to send a donation like request that it completely free. After a short ad is shown on the top right, your message will apear. This is way to make sure I see your message as well supporting the stream. To send a messgae go to: https://loots.com/theborglive"
		);
	}
}

const CommandsCommand: IChatCommand = {
	key: "!commands",
	badge: Badge.broadcaster,
	action: (client: Client, config: IConfiguration) => {
		client.action(
			config.channel,
			"!follow    !twitchprime    !discord    !loot    !uptime    !permit  !so    !poll    !closepoll    !answer    !leave    NOTE:  Some commands can only be used a mod or the streamer."
		);
	}
}

const FollowCommand: IChatCommand = {
	key: "!follow",
	badge: Badge.broadcaster,
	action: (client: Client, config: IConfiguration) => {
		client.action(
			config.channel,
			"Please be sure to follow the stream so you can be notified when I go live next! It really helps the channel grow and build a great community."
		);
	}
}

const TwitchPrimeCommand: IChatCommand = {
	key: "!twitchprime",
	badge: Badge.broadcaster,
	action: (client: Client, config: IConfiguration) => {
		client.action(
			config.channel,
			"If you wish to give back to the stream and you have Amazon Prime, you can get one free Twitch Prime subscription a month. You can subscribe by clicking above the stream or by clicking https://www.twitch.tv/products/theborgLIVE/ticket/new"
		);
	}
}

const Commands: IChatCommand[] = [HelloCommand, DiscordCommand, LootsCommand, CommandsCommand, FollowCommand, TwitchPrimeCommand];

export { Commands };
