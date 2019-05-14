var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(!triggerUtils.isUserAdmin(msg.author.id, config)){ return false; }
  if(msg.content.toLowerCase() != '!update'){ return false; }
  // if(msg.author.bot){ return false; }
  // if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  // if(msg.channel.type != "dm"){ return false; }
  return true;
}

exports.run = function(eventType, client, msg, config){
  msg.channel.send("Updating the bot, this may take a few seconds please stand by.");
  triggerUtils.git_pull(config);
}
