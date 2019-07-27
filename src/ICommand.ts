import { Client, UserNoticeState } from "tmi.js";
import { IConfiguration } from "./IConfiguration";

export interface ICommand {
	key: string;
	action: ActionFunction;
	badges?: Badge[];
}

interface ActionFunction {
	(client: Client, config: IConfiguration, channel?: string, user?: UserNoticeState, message?: string, self?: boolean): void;
}

export enum Badge {
	admin = "admin",
	bits = "bits",
	broadcaster = "broadcaster",
	global_mod = "global_mod",
	moderator = "moderator",
	subscriber = "subscriber",
	staff = "staff",
	turbo = "turbo"
}
