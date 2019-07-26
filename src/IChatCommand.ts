import tmi, { Client } from "tmi.js";
import { IConfiguration } from "./IConfiguration";

export interface IChatCommand {
	key: string;
	action: ActionFunction;
}

interface ActionFunction {
	(client: Client, config: IConfiguration): void;
}
