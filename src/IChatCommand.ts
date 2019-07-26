import tmi, { Client } from "tmi.js";
import { IConfiguration } from "./IConfiguration";

export interface IChatCommand {
	key: string;
	action: ActionFunction;
	badge: Badge;
}

interface ActionFunction {
	(client: Client, config: IConfiguration): void;
}

export enum Badge {
	admin = "admin",
	bits = "bits",
	broadcaster = "broadcaster",
	global_mod = "global_mod",
	moderator = "moderator",
	subscriber = "subscriber",
	staff = "staff",
	turbo = "turbo",
	any = "any"
}
