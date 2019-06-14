var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  // if(client.user.id != config.user_ids.rd_id){ return false; }
  if(msg.content.toLowerCase() != 'std::code()' && msg.content.toLowerCase() != 'std::code;' && msg.content.toLowerCase() != 'std::code' && msg.content.toLowerCase() != 'std::code();' && msg.content.toLowerCase() != '!code'){
     return false;
  }
  // if(msg.channel.type != "dm"){ return false; }
  return true;
}

exports.run = function(eventType, client, msg, config){
  if (msg.content.toLowerCase() == 'std::code()') {
    triggerUtils.delaySend(client,msg,"expected ';' after 'code'" ,null);
    return true;
  }

  if (msg.content.toLowerCase() == 'std::code;' || msg.content.toLowerCase() == 'std::code') {
    triggerUtils.delaySend(client,msg,"statement is a reference, not call, to function 'code' [-Waddress]" ,null);
    return true;
  }

  if (msg.content.toLowerCase() == 'std::code();' || msg.content.toLowerCase() == '!code' || msg.content.toLowerCase().startsWith('std::code();')) {
    if(client.user.id == config.user_ids.rd_id){
      var messageText = 'My code can be found here: <'+config.github.url+'> \nFeel free to add issues to the issue tracker, or even submit pull requests. Also while you are there why not give us a star. \nRubber Duck is courtesy of "Eli#8092" and "Phi11ipus#4667". If you find any bugs or have a feature suggestion feel free to send one of them a PM.';
      triggerUtils.delaySend(client,msg,messageText,1000);
    }else if(client.user.id == config.user_ids.rm_id){
      var messageText = 'Hold up, my code can also be found at that link... Stop trying to take credit for all my hard work!';
      triggerUtils.delaySend(client,msg,messageText,1500);
    }
  }
}
