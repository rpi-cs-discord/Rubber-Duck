var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  // if(msg.channel.type != "dm"){ return false; }

  if(msg.content != "!mc" && msg.content != "!minecraft" && msg.content != "!ip"){
     return false;
  }

  return true;
}

var request = require("request")
exports.run = function(eventType, client, msg, config){
  var url = "https://mcapi.us/server/status?ip="+config.minecraft.ip
  request({
    url: url,
    json: true
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var online="Offline"
      if(body.online){online="Online";}

      //TODO switch username to displayName
      msg.channel.send("", {embed: {
          color: 0x3e5c20,
          author: {
            name: "⁠",
            icon_url: "https://discordemoji.com/assets/emoji/grassblock.png"
          },

          description: "**IP: ** "+config.minecraft.ip+"\n**Status: **" + online +"\n**Players: **" + body.players.now +"/"+body.players.max,
          footer: {
            text: "Minecraft server is courtesy of @" + client.guilds.get(config.default_server.id).members.get(config.minecraft.host_discord_id).user.username
          }
        }
      });
    }
  })
}
