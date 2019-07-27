import { Badges } from "tmi.js";
import { Badge } from "./ICommand";

export class CommandHelpers {

	/**
	 * IsCommandAvailableToUser
	 */
	public static IsCommandAvailableToUser(badges: Badge[] | undefined, userBadges: Badges | undefined): boolean {

		if (!userBadges) {
			throw new Error("user.badges is undefined.");
		}

		if (!badges) {
			return true;
		}

		badges.forEach(badge => {
			if (userBadges && userBadges[badge]) {
				return true;
			}
		});

		return false;
	}
}
