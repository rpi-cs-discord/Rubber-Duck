var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  // if(eventType != "message"){ return false; }
  // if(msg.author.bot){ return false; }
  // if(client.user.id != config.ids.rd_id){ return false; }
  // if(msg.channel.type != "dm"){ return false; }
  return true;
}

exports.run = function(eventType, client, msg, config){
  console.log("Just ran: " + name);
}
