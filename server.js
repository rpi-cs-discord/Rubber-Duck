//Config
//Loads in the config file
const fs = require("fs");
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var triggerUtils = require('./trigger_utils.js');

//Glitch Stuff
const express = require('express');
const app = express();
const http = require('http');
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen("3000");
setInterval(() => {
  http.get(config.glitch.url);
}, 120000);
app.post('/pull-git', function(request, response) {
  response.send("ok")//this line is needed
  console.log("Told to pull")
  triggerUtils.git_pull(config);
});
app.get('/pull-git', function(request, response) {
  response.send("ok")//this line is needed
});


require('dotenv').config();
const Enmap = require("enmap");

const Discord = require("discord.js");
const rdClient = new Discord.Client();
const rmClient = new Discord.Client();

//Load in trigger files
var triggers = new Enmap();
fs.readdir("./Rubber-Duck/triggers/", function(err, files){
  if (err) return console.error(err);
  files.forEach(function(file){
    if (!file.endsWith(".js")){ return; }
    let props = require(`./triggers/${file}`);
    let commandName = file.split(".")[0];
    if(commandName=="template"){ return; }
    console.log(`Loading command: ${commandName}`);
    triggers.set(commandName, props);
  });
});


rdClient.on('ready', function() {
  console.log("Ready RD");
  if(!config.activity.rd_type){ return; }
  this.user.setActivity(config.activity.rd_text, {
    type: config.activity.rd_type
  })
});
rmClient.on('ready', function() {
  console.log("Ready RM");
  if(!config.activity.rd_type){ return; }
  this.user.setActivity(config.activity.rm_text, {
    type: config.activity.rm_type
  })
});

//Discord Events
var database = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
rdClient.on('message', function(msg) {
  if(triggerUtils.notEmojiMode(msg, config, this, database)){
    runTriggers('message', this, msg);
  }else{
    triggerUtils.emojiMode(msg, this, config);
  }
});
rmClient.on('message', function(msg) {
  if(triggerUtils.notEmojiMode(msg, config, this, database)){
    runTriggers('message', this, msg);
  }
});

rdClient.on('messageDelete', function(msg) {
  runTriggers('messageDelete', this, msg);
});
rmClient.on('messageDelete', function(msg) {
  runTriggers('messageDelete', this, msg);
});

rdClient.on('messageUpdate', function(msgOld, msgNew) {
  runTriggers('messageUpdate', this, msgOld, msgNew);
});
rmClient.on('messageUpdate', function(msgOld, msgNew) {
  runTriggers('messageUpdate', this, msgOld, msgNew);
});

rdClient.on('presenceUpdate', function(oldMember, newMember) {
  runTriggers('presenceUpdate', this, oldMember, newMember);
});
rmClient.on('presenceUpdate', function(oldMember, newMember) {
  runTriggers('presenceUpdate', this, oldMember, newMember);
});

rdClient.on('guildMemberAdd', function(member) {
  runTriggers('guildMemberAdd', this, member);
});
rmClient.on('guildMemberAdd', function(member) {
  runTriggers('guildMemberAdd', this, member);
});

rdClient.on('guildMemberRemove', function(member) {
  runTriggers('guildMemberRemove', this, member);
});
rmClient.on('guildMemberRemove', function(member) {
  runTriggers('guildMemberRemove', this, member);
});

rdClient.on('messageReactionAdd', function(msgReaction, user) {
  runTriggers('messageReactionAdd', this, msgReaction, user);
});
rmClient.on('messageReactionAdd', function(msgReaction, user) {
  runTriggers('messageReactionAdd', this, msgReaction, user);
});


function runTriggers(eventType, client, msg, extra){
  if(eventType != "presenceUpdate"){ console.log(eventType) }
  triggers.some(function(trigger, commandName){

    //allows you to disable all but specific triggers when in development
    if(config.development_settings.development){
      if(config.development_settings.triggers_to_run.length > 0){
        if(!config.development_settings.triggers_to_run.includes(commandName)){
          return false;
        }
      }
    }

    if(trigger.shouldRun(eventType, client, msg, config, extra)){
      trigger.run(eventType, client, msg, config, database, extra)
      // return true;
    }
  })
}

rdClient.login(process.env.RD_TOKEN);
rmClient.login(process.env.RM_TOKEN);
