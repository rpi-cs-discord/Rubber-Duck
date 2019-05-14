var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "messageUpdate" && eventType != "messageDelete"){ return false; }
  if(msg.author.bot){ return false; }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  if(!(msg.content.startsWith("!echo") || msg.content.startsWith("!translate"))){ return false; }
  return true;
}

exports.run = function(eventType, client, msg, config){
  if(!tryAndRemove(msg)){
    //This runs again because if a user removes their message too fast it can bypass the first remove
    setTimeout(function(){
        tryAndRemove(msg);
    }, 1000);
  }
}

function tryAndRemove(msg){
  msg.channel.fetchMessages({"after":msg.id, "limit":10})
  .then(messages => {
    messages.forEach(function(msg2){
      if(msg2.author.bot && msg2.content.startsWith(triggerUtils.textAfterGap(msg.content).trim())){
        msg2.delete();
        return true;
      }
    })
  });
  return false;
}
