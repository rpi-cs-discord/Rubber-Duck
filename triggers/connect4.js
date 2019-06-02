var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);
const Discord = require("discord.js");

exports.shouldRun = function(eventType, client, msg, config, user){
  if(client.user.id != config.user_ids.rd_id){ return false; }
  if(eventType == "message"){
    if(!msg.content.startsWith("!cf") && !msg.content.startsWith("!c4")){ return false; }
    if(msg.mentions.members.array().length == 0){return false;}
    if(msg.mentions.members.get(msg.author.id)){ return false; }
    if(msg.author.bot){ return false; }
  } else if(eventType == "messageReactionAdd"){
    if(user.bot){ return false; }
    return true;
  }else{
    return false;
  }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(msg.channel.type == "dm"){ return false; }
  return true;
}


var playerFaces = ["😄","😡","👿","🤢","💀","🤖","🐵","🐷"];
exports.run = function(eventType, client, msg, config, database, extra){
  if(eventType == "message"){
    var width = 1;
    if(width > 20){width=20;}
    var height = 10;
    var titleText = "";
    titleText += playerFaces[0]
    titleText += msg.guild.members.get(msg.author.id).user
    for(var i=0;i<msg.mentions.members.array().length;i++){
      titleText+=" vs "
      titleText += playerFaces[1+i]
      titleText += msg.guild.members.get(msg.mentions.members.array()[i].user.id).user
    }
    titleText+="\n"

    var whichCol = ""
    for(var i=0;i<width;i++){
      if(i<=9){
        whichCol += String.fromCharCode(parseInt("00" + (30+i),16)) + "\u20E3";
      }else if(i==10){
        whichCol += "\uD83D\uDD1F"
      }else{
        whichCol += "\ud83c"+String.fromCharCode(parseInt("dde" + (-5+i).toString(16),16))+"⁠";
      }
    }
    whichCol+="\n";

    var board = "";
    for(var i=0;i<height;i++){
      for(var j=0;j<width;j++){
        board += "⚫";
      }
      board += "\n"
    }

    const embed = {
      "description":titleText+whichCol+board+whichCol,
      // "color": 7775037,
      "footer": {
        "text": "Game Length: 0min"
      }
    };
    msg.channel.send("Playing connect 4: "+playerFaces[0]+"@eli's turn", { embed }).then(function(board){
      async function react(width) {
        for(var i=0;i<width;i++){
          if(i<=9){
            await board.react(String.fromCharCode(parseInt("00" + (30+i),16)) + "\u20E3");
          }else if(i==10){
            await board.react("\uD83D\uDD1F");
          }else{
            await board.react("\ud83c"+String.fromCharCode(parseInt("dde" + (-5+i).toString(16),16)));
          }
        }
      }
      react(width);
    });
  }else if(eventType == "messageReactionAdd"){
    +new Date
    msg.message.embeds[0].footer.text = "Game Length: "+Math.round((Date.now()-msg.message.createdTimestamp)/1000/60)+"min";
    msg.message.edit("Playing connect 4: "+playerFaces[0]+"@eli's turn", new Discord.RichEmbed(msg.message.embeds[0]));
  }
}
