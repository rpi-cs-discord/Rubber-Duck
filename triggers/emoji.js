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
console.log("here");
  // var changes = {
  //   "123":"emojiOnlyServers",
  //   "321":"emojiOnlyUsers"
  // }
  var changes = {};
  if(triggerUtils.textAfterGap(msg.content)){
    var result;
    triggerUtils.textAfterGap(msg.content).match(re).forEach(function(result){
      changes[result]="emojiOnlyUsers";
    })
  }else{
    changes[msg.channel.id]="emojiOnlyServers";
  }

  console.log(changes)
  for (var id in changes) {
    var emojiModeType = changes[id];
    database[emojiModeType][id]=!database[emojiModeType][id];

    var ateveryone = client.guilds.get(msg.channel.guild.id).roles.find(role => role.name === "@everyone")
    if(msg.content.toLowerCase() == "!emoji-on"){
      database[emojiModeType][id]=true;
      msg.channel.overwritePermissions(ateveryone,{EMBED_LINKS:false});
    }
    if(msg.content.toLowerCase() == "!emoji-off"){
      database[emojiModeType][id]=false;
      msg.channel.overwritePermissions(ateveryone,{EMBED_LINKS:null});
    }
    if(msg.content.toLowerCase() == "!emoji-h" || msg.content.toLowerCase() == "!emoji-on"  || msg.content.toLowerCase() == "!emoji-off"){
      msg.delete()
    }else{
      if(database[emojiModeType][id]){
        msg.channel.send("This channel is now in emoji only mode. Your messages must only contain emoji.");
        msg.channel.overwritePermissions(ateveryone,{EMBED_LINKS:false});
      }else{
        msg.channel.send("Emoji Mode has been turned off. You are free to send normal text.");
        msg.channel.overwritePermissions(ateveryone,{EMBED_LINKS:null});
      }
    }
  }
  fs.writeFile("./database.json", JSON.stringify(database),function(err, contents){});
}
