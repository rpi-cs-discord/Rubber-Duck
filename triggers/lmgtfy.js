var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }

  var command = triggerUtils.textBeforeGap(msg.content);
  if(command != "!lmgtfy" && command != "!lmdtfy"){
     return false;
  }
  if(!triggerUtils.textAfterGap(msg.content)){ return false; }

  return true;
}

var request = require("request")
exports.run = function(eventType, client, msg, config){
  var url = "https://lmgtfy.com/?"
  if(triggerUtils.textBeforeGap(msg.content) == "!lmdtfy"){
    url += "s=d&"
  }
  url += "q=" + encodeURIComponent(triggerUtils.textAfterGap(msg.content))
  msg.channel.send("<" + url + ">")
}
