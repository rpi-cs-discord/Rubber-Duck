var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  // if(msg.channel.type != "dm"){ return false; }
  if(msg.content.toLowerCase() != "!help"){ return false; }
  return true;
}

exports.run = function(eventType, client, msg, config){
  if(msg.channel.type == "dm" || triggerUtils.isValidChannel(msg.channel.id, config.role_management.valid_channel_ids)){
    msg.channel.send(
                      'To view the available classes type "!classes"\n'
                    + 'To add a class type "!add **[CLASS NAME]**"\n'
                    + 'To remove a class type "!remove **[CLASS NAME]**"\n'
                    + 'To view the chats for all classes type "!add All-Seer"\nYou can remove this ability with "!remove All-Seer'
                    // + '\nDont forget to also view our rules with "!rules"\n'
                    + '\nAlso if you want to view my code just type !code'
                    );
  }else{
    msg.channel.send(config.role_management.anti_spam_message);
  }
}
