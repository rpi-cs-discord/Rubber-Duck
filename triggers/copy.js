var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(client.user.id != config.user_ids.rd_id){ return false; }
  if(eventType == "message"){
    if(msg.author.bot){return false;}
  }else if(eventType == "messageUpdate"){
  }else{
    return false;
  }
  if(msg.channel.type != "dm"){ return false; }
  // if(msg.author.bot){ return false; }
  // if(client.user.id != config.user_ids.rd_id){ return false; }
  // if(msg.channel.type != "dm"){ return false; }


  return true;
}

exports.run = function(eventType, client, msg, config, newMsg){
  //This needs a lot of work

}
