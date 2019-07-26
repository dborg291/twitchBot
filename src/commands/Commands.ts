import { IChatCommand, Badge } from "../IChatCommand";
import { Client } from "tmi.js";
import { IConfiguration } from "../IConfiguration";

const HelloCommand: IChatCommand = {
	key: "!hello",
	badge: Badge.broadcaster,
	action: (client: Client, config: IConfiguration) => {
		client.action(config.channel, "Hello!");
	}
};

const Commands: IChatCommand[] = [HelloCommand];

export { Commands };
