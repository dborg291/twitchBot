# twitchBot

**What is it:** This is a chat bot that can connect to any Twitch channel's chat. The bot is able to send various messages based on certain key messages being sent.

**Main Features:**
- Send messages based on the use of key messages
    - !leave - bot disconnects from the chat (Streamer Only)
    - !follow - sends a message reminding views to follow the channel (Mods and Streamer)
    - !twitchprime - sends a message reminding the viewers that they can subscribe to the channel using Twitch Prime for free (Mods and Streamer)
    - !permit [TwitchUserName] - allows the specified user to send a link to the chat (Mods and Streamer)
    - !discord - sends a messages containing the permanent discord invite link to the streamer's discord (Everyone)
    - !loot - sends a message reminder the views they can have a message appear on screen while also supporting the streamer (Everyone)
    - !song - sends a message stating the name and artist of the song that the streamer is currently playing (Everyone)
    - !uptime - sends a message stating how long the streamer has been live for (Everyone)
    - !commands - send a message displaying all the commands that are available to be used in the chat (Everyone)
    - !so @[TwitchUserName] - send a message shouting out the specified user (Mods and Streamer)
    - !poll [Poll Question] | [Option 1] | [Option 2] | [Option 3] - creates a poll for audience to answer, unlimited number of options are possible, but only one poll allowed at a time (Mods and Streamer)
    - !closepoll - closes the currently active poll, sends a message saying; poll is closed, the number of votes from chat, and the vote distribution percentage (Mods and Streamer)
    - !answer [Option Number] - collects the poll vote from the user (Everyone)
- Notify chat when a viewer has; subscribed, re-subscribed, or started hosting the channel
- Automatically time-out viewers (who are not mods or the streamer) for sending a link, without already having been permitted to send one
- Send a promotional message, such as !follow, !twitchprime, !discord, or !loot, at random every 30 minutes
- Automatically run a 30 second commercial every 30 minutes

**Installation/Setup:**

1. Clone Repo
2. `npm install -g typescript`
3. `npm install`
4. Create a new folder called "config" in the root directory and a file called "constants.json" within config
5. Paste this code snippet into constants.json:
    ~~~
   {
    "username":
    "password":
    "clientID":
    "channel":
    "spotifyClientID":
    "spotifyClientSecret":
    "spotifyOAuthToken":
    "spotifyRedirectURI":
    "spoiftyAPILink":
    "discordLink":
    "loyaltyPointURL":
    }
    ~~~
6. Under Twitch API:
    * username: Bot's Twitch username
    * password: Bots' Twitch OAUTH code, go here for the token: https://twitchapps.com/tmi/
    * clientID: Bot's clientID, go here for setup: https://dev.twitch.tv/
    * channel: The name of the twitch channel you want the bot to connect to.
7. Under Spotify API:
    * spotifyClientID:  Bot's clientID, go here for setup: https://developer.spotify.com/
    * spotifyClientSecret: Bot's client secret, go here for setup: https://developer.spotify.com/
    * spotifyOAuthToken: Bot's Spotify OAUTH code, go here for setup: https://developer.spotify.com/
    * spotifyRedirectURI: Bot's redirect URI, go here for setup: https://developer.spotify.com/
    * spoiftyAPILink: Connect Groke to your Spotify account, go here for setup: https://www.groke.se/twitch/spotify
8. Under Discord:
    * discordLink: permanent invite link
9. `tsc`
10. `npm start`

---

## Todo

* implement a command registry
* implement command providers

---

## Contributors
- Daniel Borg - [https://github.com/dborg291](https://github.com/dborg291)
- Alex Weininger - [https://github.com/alexweininger](https://github.com/alexweininger)
