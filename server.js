//Config
//Loads in the config file
const fs = require("fs");
var config = JSON.parse(fs.readFileSync('./Rubber-Duck/config.json', 'utf8'));

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
  git_pull();
});
app.get('/pull-git', function(request, response) {
  response.send("ok")//this line is needed
});

function git_pull(){
  const { exec } = require('child_process');
  exec('cd Rubber-Duck && git fetch --all && git reset --hard origin/master && refresh && ./package-json-update.sh', (err, stdout, stderr) => {
    if(err){return;}
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}


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
    console.log(`Attempting to load command: ${commandName}`);
    triggers.set(commandName, props);
  });
});


rdClient.on('ready', function() {
  console.log("Ready RD");
  this.user.setActivity(config.activity.rd_text, {
    type: config.activity.rd_type
  })
});
rmClient.on('ready', function() {
  console.log("Ready RM");
  this.user.setActivity(config.activity.rm_text, {
    type: config.activity.rm_type
  })
});

//Discord Events
rdClient.on('message', function(msg) {
  runTriggers('message', this, msg);
});
rmClient.on('message', function(msg) {
  runTriggers('message', this, msg);
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


function runTriggers(eventType, client, msg, extra){
  console.log(eventType)
  triggers.some(function(trigger, commandName){
    if(trigger.shouldRun(eventType, client, msg, config, extra)){
      trigger.run(eventType, client, msg, config, extra)
      // return true;
    }
  })
}

rdClient.login(process.env.RD_TOKEN);
rmClient.login(process.env.RM_TOKEN);
