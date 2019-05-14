var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType != "message"){ return false; }
  if(msg.author.bot){ return false; }
  if(client.user.id != config.user_ids.rd_id){ return false; }
  if(!msg.content.startsWith('\\gen_class')){ return false; }

  // for(var i=0;i<config.user_ids.admin_ids.length;i++){
  //   if(config.user_ids.admin_ids[i] == msg.author.id){
  //     return true;
  //   }
  // }
  if(!triggerUtils.isUserAdmin(msg.author.id, config)){ return false; }
  return true;
}

exports.run = function(eventType, client, msg, config){
  var SERVER = client.guilds.get(config.default_server.id);

  var className = msg.content.substring(msg.content.indexOf(' ') + 1);
  msg.channel.send('Generating ' + className);

  // GENERATE ROLES
  var timeout = SERVER.roles.find(role => role.name === "Time-Out")
  var allseer = SERVER.roles.find(role => role.name === "All-Seer")
  var permissionOverwrites = [{
    id: SERVER.defaultRole.id,
    denied: ['VIEW_CHANNEL']
  }, {
    id: allseer.id,
    allowed: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
  }, {
    id: timeout.id,
    denied: ['SEND_MESSAGES']
  }];
  var toCreate = [className];
  toCreate.forEach(roleName => {
    SERVER.createRole({
      name: roleName,
      hoist: false,
      mentionable: false,
      color: 'DEFAULT'
    }).then(role => {
      var overwrite = {
        id: role.id,
        allowed: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
      };
      permissionOverwrites.push(overwrite);
      console.log("Created role " + roleName);
      if (permissionOverwrites.length === 3+toCreate.length) {
        GenerateChannels(msg, SERVER, permissionOverwrites, className);
      }
    });
  });
}


function GenerateChannels(msg, SERVER, permissionOverwrites, className) {
  var channelNames = ['general', 'homework', 'labs'];
  SERVER.createChannel(className, 'category', permissionOverwrites)
    .then(categoryChannel => {
      channelNames.forEach(name => {
        SERVER.createChannel(name, 'text', permissionOverwrites).then(channel=>{
          channel.setParent(categoryChannel)
        });
      });
      msg.channel.send('Roles and channels for ' + className + ' have been created.  Don\'t forget to set the correct colors for roles and order for both channels and roles.  Also, if there is no lab for this class remember to delete that channel.');
    });
}
