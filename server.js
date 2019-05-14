require('dotenv').config();
const fs = require("fs");
const Enmap = require("enmap");

const Discord = require("discord.js");
const rdClient = new Discord.Client();
const rmClient = new Discord.Client();

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


// setTimeout(function () {
//   triggers.forEach(function(trigger, commandName){
//     if(trigger.shouldRun()){
//       trigger.run();
//     }
//   })
// }, 300);

var config = JSON.parse(fs.readFileSync('./Rubber-Duck/config.json', 'utf8'));

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

rdClient.on('message', function(msg) {
  runTriggers('message', this, msg);
});
rmClient.on('message', function(msg) {
  runTriggers('message', this, msg);
});


function runTriggers(eventType, client, msg){
  triggers.forEach(function(trigger, commandName){
    if(trigger.shouldRun(eventType, client, msg, config)){
      trigger.run(eventType, client, msg, config);
    }
  })
}

rdClient.login(process.env.RD_TOKEN);
rmClient.login(process.env.RM_TOKEN);
