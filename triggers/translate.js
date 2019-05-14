var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  if(!msg.content.startsWith("!translate")){ return false; }
  if(!triggerUtils.textAfterGap(msg.content)){ return false; }
  return true;
}

const translate = require('@vitalets/google-translate-api');
exports.run = function(eventType, client, msg, config){
  var text = triggerUtils.textAfterGap(msg.content)

  translate(text, {to: 'en'}).then(res => {
    msg.channel.send(text + " translates from " + res.from.language.iso.toUpperCase() + " to: " + "`"+res.text+"`")
  }).catch(err => {
    console.error(err);
  });
}
