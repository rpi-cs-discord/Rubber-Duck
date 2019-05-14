var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  if(msg.channel.id==config.rdd.rdd_channel_id){ return true; }
  if(msg.channel.type == "dm" && !(msg.content.startsWith("!") || msg.content.startsWith("="))){ return true; }
  return false;
}

const fs = require("fs");
var quacks = JSON.parse(fs.readFileSync('./Rubber-Duck/quacks.json', 'utf8'));//load in quacks from json file
exports.run = function(eventType, client, msg, config){
  var messageText = quacks.generic_quacks[Math.floor(Math.random() * quacks.generic_quacks.length)];
  triggerUtils.delaySend(client,msg,messageText,null);
}
