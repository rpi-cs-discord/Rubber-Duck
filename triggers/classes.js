var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  // if(msg.channel.type != "dm"){ return false; }
  if(msg.content.toLowerCase() != "!classes"){ return false; }
  return true;
}

exports.run = function(eventType, client, msg, config){
  if(msg.channel.type == "dm" || triggerUtils.isRoleManagementChannel(msg.channel.id, config)){
    var server = client.guilds.get(config.default_server.id);
    var classRoles = config.addable_roles;
    var roleNames = "";
    for(var i=0;i<classRoles.length;i++){
      roleNames += "**";
      roleNames+=" " + classRoles[i].roleName
      roleNames += "**";
      if(classRoles[i].department && classRoles[i].courseCode){
        roleNames+=" " + classRoles[i].department + "-" + classRoles[i].courseCode
      }

      if(i<classRoles.length-1){roleNames+="\n";}
    }
    var embedObj = {embed: {
      color: 3447003,
      // description: roles
    }}
    embedObj.embed.description = roleNames;

    messageToSend = 'To see the chats for all classes you can also add "**All-Seer**"'
    msg.channel.send(messageToSend, embedObj);
    return true;
  }else{
    msg.channel.send(config.role_management.anti_spam_message);
  }
}
