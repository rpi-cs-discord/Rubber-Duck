exports.textAfterGap = function(text){
  return text.match(/^(\S+)\s+(.*)/);
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
