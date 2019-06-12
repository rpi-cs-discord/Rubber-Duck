var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  if(msg.content.toLowerCase() != "!ai" && msg.content.toLowerCase() != "!academic integrity"){
     return false;
  }
  // if(msg.channel.type != "dm"){ return false; }
  return true;
}

exports.run = function(eventType, client, msg, config){
  //TODO move this text to config
  triggerUtils.delaySend(client,msg,"Please do not share any class related code on this server. If you see any code please PM an admin to have it removed. \nAlso make sure you are following the Academic Integrity as stated on page 16 of the Student Handbook: https://info.rpi.edu/sites/default/files/Rensselaer%20Handbook%20of%20Student%20Rights%20%26%20Responsibilities%20%C2%BB.pdf",null);
}
