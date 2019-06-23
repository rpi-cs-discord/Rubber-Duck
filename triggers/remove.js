var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  // if(msg.channel.type != "dm"){ return false; }
  if(!msg.content.toLowerCase().startsWith("!remove")){ return false; }
  return true;
}

exports.run = function(eventType, client, msg, config){
  if(msg.channel.type == "dm" || triggerUtils.isValidChannel(msg.channel.id, config.role_management.valid_channel_ids)){
    var server = client.guilds.get(config.default_server.id);

    if(msg.content.toLowerCase() == "!remove all-seer"){
      msg.channel.send('You are no longer an All-Seer.');
      server.members.get(msg.author.id).removeRole(server.roles.find(role => role.name === "All-Seer").id)
      return true;
    }

    var classRoles = config.addable_roles;
    if(triggerUtils.textAfterGap(msg.content)){
      var roleName = triggerUtils.textAfterGap(msg.content).toLowerCase()
      for(var i=0;i<classRoles.length;i++){
        if(classRoles[i].roleName.toLowerCase() == roleName){
          // todo add message if they already have that role
          msg.channel.send('You have been removed from the class "' + classRoles[i].roleName + '"');
          server.members.get(msg.author.id).removeRole(server.roles.find(role => role.name === classRoles[i].roleName).id)
          return true;
        }
      }
      msg.channel.send('Could not find a class named "' + roleName + '"');
      return true;
    }

    if(msg.content.startsWith("!remove")){
      msg.channel.send('Use this command to remove a class role you are currently assigned to for example:\n`!remove DS`');
    }
  }else{
    msg.channel.send(config.role_management.anti_spam_message);
  }
}
