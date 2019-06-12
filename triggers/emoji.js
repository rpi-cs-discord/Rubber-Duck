var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

var re = new RegExp("[0-9]{18}|[0-9]{17}", "g");

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  if(!triggerUtils.isUserAdmin(msg.author.id, config)){ return false; }
  // if(msg.channel.type != "dm"){ return false; }


  if(msg.content.toLowerCase() == "!emoji" || msg.content.toLowerCase() == "!emoji-h" || msg.content.toLowerCase() == "!emoji-on" || msg.content.toLowerCase() == "!emoji-off"){
     return true;
  }

  if(msg.content.toLowerCase().startsWith("!emoji") && triggerUtils.textAfterGap(msg.content).match(re)){
    console.log("user emoji mode");
    return true;
  }

  return false;
}

const fs = require("fs");
exports.run = function(eventType, client, msg, config, database){
  var changes = {};
  if(triggerUtils.textAfterGap(msg.content)){
    var result;
    triggerUtils.textAfterGap(msg.content).match(re).forEach(function(result){
      changes[result]="emojiOnlyUsers";
    })
  }else{
    changes[msg.channel.id]="emojiOnlyServers";
  }

  // console.log(changes)
  var ateveryone = client.guilds.get(msg.channel.guild.id).roles.find(role => role.name === "@everyone")
  for (var id in changes) {
    var emojiModeType = changes[id];
    database[emojiModeType][id]=!database[emojiModeType][id];

    var overwritePermissionRole = ateveryone;
    //This code was commented out because it is really only needed if we every add channel specific emoji only mode
    // if(emojiModeType == "emojiOnlyUsers"){
    //   overwritePermissionRole = client.guilds.get(config.default_server.id).members.get(id);
    // }


    if(msg.content.toLowerCase() == "!emoji-on"){
      database[emojiModeType][id]=true;
      if(emojiModeType == "emojiOnlyServers"){
        msg.channel.overwritePermissions(overwritePermissionRole,{EMBED_LINKS:false});
      }
    }
    if(msg.content.toLowerCase() == "!emoji-off"){
      database[emojiModeType][id]=false;
      if(emojiModeType == "emojiOnlyServers"){
        msg.channel.overwritePermissions(overwritePermissionRole,{EMBED_LINKS:null});
      }
    }
    if(msg.content.toLowerCase() == "!emoji-h" || msg.content.toLowerCase() == "!emoji-on"  || msg.content.toLowerCase() == "!emoji-off"){
      msg.delete()
    }else{
      if(database[emojiModeType][id]){
        if(emojiModeType == "emojiOnlyServers"){
          msg.channel.send("This channel is now in emoji only mode. Your messages must only contain emoji.");
          msg.channel.overwritePermissions(overwritePermissionRole,{EMBED_LINKS:false});
        }else{
          msg.channel.send("<@"+id+"> you are now in emoji only mode. Your messages must only contain emoji.");
        }
      }else{
        if(emojiModeType == "emojiOnlyServers"){
          msg.channel.send("This channel is no longer in emoji only mode. You are free to send normal text.");
          msg.channel.overwritePermissions(overwritePermissionRole,{EMBED_LINKS:null});
        }else {
          msg.channel.send("<@"+id+"> you are no longer in emoji only mode. You are free to send normal text.");
        }
      }
    }
  }
  fs.writeFile("./database.json", JSON.stringify(database),function(err, contents){});
}
