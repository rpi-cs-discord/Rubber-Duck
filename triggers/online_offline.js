var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, oldMember, config, newMember){
  if(eventType != "presenceUpdate"){ return false; }
  // if(msg.author.bot){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  // if(msg.channel.type != "dm"){ return false; }
  if(oldMember.guild.id != config.default_server.id){ return false; }

  if(oldMember.presence.status == newMember.presence.status){ return false; }

  return true;
}

exports.run = function(eventType, client, oldMember, config, newMember){
  client.channels.get(config.logs.online_offline_id).send(newMember.user.username + ' (' + newMember.id +')' + ' is now ' + newMember.presence.status )
}
