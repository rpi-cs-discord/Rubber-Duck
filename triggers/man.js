var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  if(!msg.content.startsWith("man")){ return false; }
  if(!triggerUtils.textAfterGap(msg.content)){ return false; }
  return true;
}

var request = require("request")
exports.run = function(eventType, client, msg, config){
  var page = triggerUtils.textAfterGap(msg.content);
  page = encodeURIComponent(page);
  var url = "https://www.freebsd.org/cgi/man.cgi?query=" + page
  request({
    url: url,
    json: true
  }, function(error, response, body) {
    if(body.includes('Sorry, no data found for') || body.includes('Empty input. Please type a manual page and search again.')){
     }else{
       triggerUtils.delaySend(client, msg, url, null);
     }
  })
}
