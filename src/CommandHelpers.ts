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

		badges.forEach(badge => {
			if (userBadges && userBadges[badge]) {
				allowedCommand = true;
			}
		});

		return allowedCommand;
	}
}
