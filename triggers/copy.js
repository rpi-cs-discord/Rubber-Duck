var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(client.user.id != config.user_ids.rd_id){ return false; }
  if(eventType == "message"){
    if(msg.author.bot){return false;}
  }else if(eventType == "messageUpdate"){
    //TODO this may need to be added if the bots get the ability to update messages
  }else{
    return false;
  }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(msg.channel.type != "dm"){ return false; }
  // if(msg.author.bot){ return false; }
  // if(client.user.id != config.user_ids.rd_id){ return false; }
  // if(msg.channel.type != "dm"){ return false; }


  return true;
}

exports.run = function(eventType, client, msg, config, database, newMsg){
  //This needs a lot of work

}
