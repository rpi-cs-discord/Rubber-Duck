var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  return false;


  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  // if(msg.channel.type != "dm"){ return false; }
  if(!msg.content.toLowerCase().startsWith("!add")){ return false; }
  return true;
}

exports.run = function(eventType, client, msg, config){
  if(msg.channel.type == "dm" || triggerUtils.isValidChannel(msg.channel.id, config.role_management.valid_channel_ids)){
    var server = client.guilds.get(config.default_server.id);

    if(msg.content.toLowerCase() == "!add all-seer"){
      msg.channel.send('You are now an All-Seer. But remember, with great power comes great responsibility and a lot of notifications!\nAlso, even as an All-Seer, please keep your class list up to date to let others know which classes you are enrolled in.\nIf you don\'t want to be an All-Seer anymore, just type "!remove All-Seer"');
      server.members.get(msg.author.id).addRole(server.roles.find(role => role.name === "All-Seer").id)
      return true;
    }

    var classRoles = config.role_management.addable_roles;
    if(triggerUtils.textAfterGap(msg.content)){
      var roleName = triggerUtils.textAfterGap(msg.content).toLowerCase()
      for(var i=0;i<classRoles.length;i++){
        if(classRoles[i].toLowerCase() == roleName){
          // todo add message if they already have that role
          //console.log(msg.author.id)
          msg.channel.send('You have been added to the class "' + classRoles[i] + '"');
          server.members.get(msg.author.id).addRole(server.roles.find(role => role.name === classRoles[i]).id)
          return true;
        }
      }
      msg.channel.send('I cannot find **' + roleName + '**, double check your spelling and try again. If this is a CS class at RPI but it is not in the current list of classes please message "@Eli#8092" or "Phi11ipus#4667".');
      return true;
    }

    if(msg.content.startsWith("!add")){
      msg.channel.send('Use this command to add a role for any class you are currently in for example: `!add DS`');
    }
  }else{
    msg.channel.send(config.role_management.anti_spam_message);
  }
}
