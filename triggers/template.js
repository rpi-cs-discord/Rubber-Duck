var triggerUtil = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  return true;
}

exports.run = function(eventType, client, msg, config){
  console.log("Just ran: " + name);
}
