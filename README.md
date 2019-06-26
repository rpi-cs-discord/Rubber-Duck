Rubber Duck
======
Rubber Duck is a fully-featured **Discord Bot** used to aid with the administration of the RPI Computer Science Discord server
([Feel free to Join Here](https://discord.gg/fH8nNMQ))

Duck and Cover!! Rubber Duck is more than it's quacked up to be. Waddle we do without this quackingly great ducknology. Let Rubber Duck take you under his wing. Make yourself feel vinduckated and deploy this in producktion and get your semiconducktors quacking.

## Installation
```bash
$ mkdir discord-bot #you really need to do this, please dont skip this step
$ cd discord-bot
$ git clone https://github.com/rpi-cs-discord/Rubber-Duck.git
$ cd Rubber-Duck
$ bash setup.sh
```
After you are done your folder structure should look like this
```
discord-bot
  ├─── Rubber-Duck
  │       ├─── package.json
  │       └─── ...
  ├─── node_modules
  │       └─── ...
  ├─── .env
  ├─── archive-channels.json
  ├─── config.json
  ├─── database.json
  └─── package.json
```
The last step is to add the correct data to the config.json file found within the discord-bot folder
<br /><br />

**Please note:** Because of how the bot is currently hosted on glitch.com you will have 2 package.json files in both your inner and outer bot folders<br />
All changes to package.json must be made to both versions in order for the bot to work correctly. The 2 package.json files contents should always be identical.

## Features

- Rubber Duck Debugging [Click to learn more](https://en.wikipedia.org/wiki/Rubber_duck_debugging)
- Welcome new members to the server
- Allow members to add and remove which computer science classes they are a part of
- Generate new channels and automatically set permissions
- Get a linux man page
- Render LaTeX images from text
- Provide live countdowns to specific events such as homework due dates or tests
- Limit a specific channel to only allow emojis
- Get live status and player count for a Minecraft server
- Keep server chat logs
- Automatically detect and deploy code updates made to the github repo

## Running the bot
Make sure you are in the outer discord-bot folder and run<br />
```
$ npm start
```
You can also use nodemon instead if you want
```
$ nodemon start
```

## Main Contributors
* [Eli Schiff](https://github.com/elihschiff)
* [Ben Sherman](https://gitlab.com/phi11ipus)

## Other
Rubber Duck is dedicated to SIS Man (1998-2019)

![](https://imgur.com/oc2397H.gif "SISMan")
