var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(client.user.id != config.user_ids.rm_id){ return false; }
  if(!msg.content.startsWith("!echo")){ return false; }
  if(!triggerUtils.textAfterGap(msg.content)){ return false; }
  return true;
}

exports.run = function(eventType, client, msg, config){
  triggerUtils.delaySend(client, msg, triggerUtils.textAfterGap(msg.content), null);
}
