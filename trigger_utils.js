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
  if(config.development_settings.development){
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

exports.isValidChannel = function(id, roles){
  for(var i=0;i<roles.length;i++){
    if(roles[i] == id){
      return true;
    }
  }
  return false;
}


var emojiStrip = require('emoji-strip')
const fs = require("fs");
var request = require('request');

exports.notEmojiMode = function(msg, config, client, database){
  if(msg.channel.type == "dm" || msg.author.bot){return true;}
  if(this.isUserAdmin(msg.author.id, config)){return true;}

  if(database.emojiOnlyServers[msg.channel.id]){
    return false;
  }
  if(database.emojiOnlyUsers[msg.author.id]){
    return false;
  }
  return true;
}

exports.emojiMode = function(msg, client, config){
  if(msg.channel.type == "dm" || msg.author.bot){return false;}
  if(msg.cleanContent.includes("<<") || msg.embeds.length > 0 || msg.attachments.size > 0){msg.delete(); return true;}
  if(msg.cleanContent.includes("Hold up, my code can also be found at that link")){
    msg.author.send("You sent a message that contained non emoji characters in an emoji only chat. Your message has been removed!")
    msg.delete();
    return true;
  }

  var msgText = msg.cleanContent;
  msgText = emojiStrip(msgText)
  msgText = msgText.replace("❤","")
  msgText = msgText.replace("🅱","")
  msgText = msgText.replace("🅰","")
  msgText = msgText.replace("1⃣","")
  msgText = msgText.replace("2⃣","")
  msgText = msgText.replace("3⃣","")
  msgText = msgText.replace("4⃣","")
  msgText = msgText.replace("5⃣","")
  msgText = msgText.replace("6⃣","")
  msgText = msgText.replace("7⃣","")
  msgText = msgText.replace("8⃣","")
  msgText = msgText.replace("9⃣","")
  msgText = msgText.replace("0⃣","")
  if(msgText.match(/[0-9]{18}/g)){
    msgText.match(/[0-9]{18}/g).map(function(val){
      var url = "https://cdn.discordapp.com/emojis/"
      url += val
      request({
        url: url,
        json: true
      }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
        }else{
          msg.author.send("You sent a message that contained non emoji characters in an emoji only chat. Your message has been removed!")
          msg.delete();
          return true;
        }
      })
    });
  }
  msgText = msgText.replace(new RegExp("\<:(.*?):[0-9]{18}\>","g"), "")
  msgText = msgText.replace(/\s/g, '');
  if(msgText.length > 0){
    msg.author.send("You sent a message that contained non emoji characters in an emoji only chat. Your message has been removed!")
    msg.delete();
    return true;
  } else {
    console.log(msg.cleanContent);
  }
}
