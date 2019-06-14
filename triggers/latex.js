var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }

  var command = triggerUtils.textBeforeGap(msg.content);
  if(command != "!tex" && command != "=tex"){
     return false;
  }
  if(!triggerUtils.textAfterGap(msg.content)){ return false; }

  return true;
}

var request = require("request")
exports.run = function(eventType, client, msg, config){
  request({
    uri: "http://latex2png.com/",
    method: "POST",
    form:{
      latex: triggerUtils.textAfterGap(msg.content),
      res: 600,
      color: "FFFFFF",
      x: 62,
      y: 28
    }
  }, function(error, response, body) {
    var myregexp = /latex_(.*)png/;
    var match = myregexp.exec(body);
    msg.channel.send("",{
        file: "http://latex2png.com/output//"+match[0]
    });
  });
}
