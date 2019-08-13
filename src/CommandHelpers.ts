import { Badges } from "tmi.js";
import { Badge } from "./ICommand";

export class CommandHelpers {

	/**
	 * IsCommandAvailableToUser
	 */
	public static IsCommandAvailableToUser(badges: Badge[] | undefined, userBadges: Badges | undefined): boolean {

		var allowedCommand: boolean = false;

		if (!userBadges) {
			throw new Error("user.badges is undefined.");
		}

		if (!badges) {
			return true;
		}

		for (let i = 0; i < badges.length; i++) {
			if (userBadges && userBadges[badges[i]]) {
				return true;
			}
		}

		return allowedCommand;
	}
}
