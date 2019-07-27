import { Badge, ICommand } from "../ICommand";
import { Client, UserNoticeState } from "tmi.js";

import { IConfiguration } from "../IConfiguration";

const HelloCommand: ICommand = {
	key: "!hello",
	action: (client: Client, config: IConfiguration) => {
		client.action(config.channel, "Hello!");
	}
};

const Commands: ICommand[] = [HelloCommand];

let commandList: Map<string, ICommand> = new Map();

Commands.forEach(command => {
	commandList.set(command.key, command);
});

const CommandList: Map<string, ICommand> = commandList;


export { Commands, CommandList };
