Rubber Duck
======
Rubber Duck is a fully-featured **Discord Bot** used to aid with the administration of the RPI computer science discord server
([Join Here](https://discord.gg/fH8nNMQ))

Duck and Cover!! Rubber Duck is more than it's quacked up to be. Waddle we do without this quackingly great ducknology. Let Rubber Duck take you under his wing. Make yourself feel vinduckated and deploy this in producktion and get your semiconducktors quacking.

## Installation
```bash
$ mkdir rubber-duck
$ cd rubber-duck
$ git clone https://github.com/elihschiff/Rubber-Duck.git
$ cp package.json ../
$ cd ..
$ npm install
```
After you are done your folder structure should look like this
```
rubber-duck
  ├─── Rubber-Duck
  │       ├─── package.json
  │       └─── ...
  ├─── node_modules
  │       └─── ...
  ├─── .env
  └─── package.json
```


**Please note:** Because of how the bot is currently hosted on glitch.com you have to copy the package.json up one folder so that it contained in the same folder as the project folder you cloned off github.<br />
All changes to package.json must be made to both versions in order for the bot to correctly work.

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
Make sure you are in the outer rubber-duck folder and run<br />
```
$ npm start
```
## Other
Rubber Duck is dedicated to SIS Man (1998-2019)

![](https://imgur.com/oc2397H.gif "SISMan")
