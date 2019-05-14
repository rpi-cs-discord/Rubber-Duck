var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, member, config){
  if(eventType != "guildMemberAdd"){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  if(member.guild.id != config.default_server.id){ return false; }
  return true;
}

exports.run = function(eventType, client, member, config){
  var server = client.guilds.get(config.default_server.id);
  var classRoles = config.role_management.addable_roles;
  var roleNames = "**";
  for(var i=0;i<classRoles.length;i++){
    roleNames += server.roles.find(role => role.name === classRoles[i]).name
    if(i<classRoles.length-1){roleNames+="\n";}
  }
  roleNames += "**";
  var embedObj = {embed: {
    color: 3447003,
  }}
  embedObj.embed.description = roleNames;

  //TODO move all this text to the config file
  var messageText = "Hi there! Welcome to the RPI Computer Science Discord Server. As you might’ve noticed, things look a little empty over there! Let’s fix that by giving you some class specific roles.\n"
             + 'To add a class, please message me `!add CLASS NAME`.  (You can view the list of classes below or with the command `!classes`)';


  messageText += '\nTo remove a class, please message me `!remove CLASS NAME`.'
  messageText += '\nIf you want to see the chats for all classes you can also `!add All-Seer`'
  messageText += '\nIf you have any questions feel free to message in the random/welcome chats or PM one of the admins, also to view the commands again type `!help`.\nOnce again, welcome!'



  member.send(messageText);
  member.send(embedObj);
  triggerUtils.delaySend(client, null, "Welcome <@" + member.id + ">! Make sure to check your PM for how to view private class-specific chats.", null, config.default_server.welcome_channel_id);
}
