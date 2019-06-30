# twitchBot

**What is it:** This is a chat bot that works can connect to any Twitch channel's chat. The bot is able to send various messages based on certain key messages being sent.

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
    - !poll [Poll Question] | [Option 1] | [Option 2] | [Option 3] - creates a poll for audience to answer, unlimited number of options are possible (Mods and Streamer)
- Notify chat when a viewer has; subscribed, re-subscribed, or started hosting the channel
- Automatically time-out viewers (who are not mods or the streamer) for sending a link, without already having been permitted to send one
- Send a promotional message, such as !follow, !twitchprime, !discord, or !loot, at random every 30 minutes
- Automatically run a 30 second commercial every 30 minutes

**Installation/Setup:**

1. Clone Repo
2. `npm install`
3. Create a new file called "botInfo.js" within the same directory as app.js
4. Paste this code snippet into botInfo.js:
    ~~~
    module.exports = {
        //Twitch API
        username: 
        password: 
        clientID: 
        channel: 

        //Spotify API
        spotifyClientID: 
        spotifyClientSecret: 
        spotifyOAuthToken: 
        spotifyRedirectURI: 
        spofityAPILink: 

        //Discord
        discordLink: 
    }
    ~~~
5. Under Twitch API:
    * username: Bot's Twitch username
    * password: Bots' Twitch OAUTH code, go here for the token: https://twitchapps.com/tmi/
    * clientID: Bot's clientID, go here for setup: https://dev.twitch.tv/
    * channel: The name of the twitch channel you want the bot to connect to.
6. Under Spotify API:
    * spotifyClientID:  Bot's clientID, go here for setup: https://developer.spotify.com/
    * spotifyClientSecret: Bot's client secret, go here for setup: https://developer.spotify.com/
    * spotifyOAuthToken: Bot's Spotify OAUTH code, go here for setup: https://developer.spotify.com/
    * spotifyRedirectURI: Bot's redirect URI, go here for setup: https://developer.spotify.com/
    * spoiftyAPILink: Connect Groke to your Spotify account, go here for setup: https://www.groke.se/twitch/spotify
7. Under Discord:
    * discordLink: permanent invite link
8. `node ./app.js`

