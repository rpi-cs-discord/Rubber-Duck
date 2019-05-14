var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if (msg.author.bot) { return false; }
  if(!msg.content.startsWith("!echo")){ return false; }
  if(client.user.id != config.ids.rm_id){ return false; };
  if(!triggerUtils.textAfterGap(msg.content)){ return false; };
  return true;
}

exports.run = function(eventType, client, msg, config){
  triggerUtils.delaySend(client, msg, triggerUtils.textAfterGap(msg.content)[2], null);
}
