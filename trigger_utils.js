exports.textAfterGap = function(text){
  if(text.match(/^(\S+)\s+(.*)/)){
    return text.match(/^(\S+)\s+(.*)/)[2].trim();
  }
  return null;
}

exports.textBeforeGap = function(text){
  if(text.match(/^(\S+)\s+(.*)/)){
    return text.match(/^(\S+)\s+(.*)/)[1].trim();
  }
  return null;
}


//msg = the message object
//messageText = the text you want to be sent
//delay = time in ms to wait before sending
//botClient = the bot that that message will be sent from
//chatID (optional) = a specific chat other than msg that you want to send to
exports.delaySend = function(botClient, msg, messageText, delay, chatID){
  if(msg){var theChannel = botClient.channels.get(msg.channel.id);}
  if(chatID){theChannel = botClient.channels.get(chatID);}
  if(!delay){delay = 1000;}

  theChannel.startTyping();
  setTimeout(function(){
    theChannel.send(messageText);
  }, delay);
  theChannel.stopTyping();
}


exports.isUserAdmin = function(id, config){
  for(var i=0;i<config.user_ids.admin_ids.length;i++){
    if(config.user_ids.admin_ids[i] == id){
      return true;
    }
  }
  return false;
}


exports.git_pull = function(config){
  if(config.development){
    console.log("FAKE DEVELOPMENT UPDATE: If this was in production, the bot would update off github now.")
    return;
  }else{
    const { exec } = require('child_process');
    exec('cd Rubber-Duck && git fetch --all && git reset --hard origin/master && refresh && ./package-json-update.sh', (err, stdout, stderr) => {
      if(err){return;}
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }
}
