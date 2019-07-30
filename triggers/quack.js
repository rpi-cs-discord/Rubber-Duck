var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }

  if(msg.content.startsWith("!") || msg.content.startsWith("=")){ return false; }
  if(msg.channel.type == "dm"){ return true; }
  if(msg.member.guild.id != config.default_server.id){ return false; }
  if(msg.mentions.users.has(client.user.id)){ return true; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  if(msg.channel.id==config.rdd.rdd_channel_id){ return true; }
  return false;
}

const fs = require("fs");
//load in quacks from fortune file
var quacks = fs.readFileSync('./Rubber-Duck/quacks.txt', 'utf8').split('\n%\n');
exports.run = function(eventType, client, msg, config){
  var messageText = quacks[Math.floor(Math.random() * quacks.length)];
  triggerUtils.delaySend(client,msg,messageText,null);
}
