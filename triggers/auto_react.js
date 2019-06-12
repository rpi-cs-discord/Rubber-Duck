var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);


//TODO this trigger has duplicate code that I want to simplify at some point



exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  // if(msg.channel.type != "dm"){ return false; }

  for (var text in config.auto_reactions) {
    var re = new RegExp("\\b" + text + "\\b");
    if (msg.content.toLowerCase().match(re)) {
      return true;
    }
  }


  return false;
}

exports.run = function(eventType, client, msg, config){
  for (var text in config.auto_reactions) {
    var re = new RegExp("\\b" + text + "\\b");
    if (msg.content.toLowerCase().match(re)) {
      async function react() {
        for (var i = 0; i < config.auto_reactions[text].length; ++i) {
          await msg.react(config.auto_reactions[text][i]);
        }
      }
      react();
      return true;
    }
  }
}
