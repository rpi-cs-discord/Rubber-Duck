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
    if(!msg.message.content.includes("Playing connect 4:")){return false;}
    return true;
  }else{
    return false;
  }
  if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
  if(msg.channel.type == "dm"){ return false; }
  return true;
}


var playerFaces = ["😄","😡","👿","🤢","💀","🤖","🐵","🐷"];
var colEmoji = ["0⃣","1⃣","2⃣","3⃣","4⃣","5⃣","6⃣","7⃣","8⃣","9⃣","🔟","🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭","🇮"]
exports.run = function(eventType, client, msg, config, database, extra){
  if(eventType == "message"){
    var width = 3;
    if(width > 20){width=20;}
    var height = 3;
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
      whichCol += colEmoji[i] + "⁠";
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
    msg.channel.send("Playing connect 4: "+playerFaces[0]+"<@"+msg.author.id+">'s turn", { embed }).then(function(board){
      async function react(width) {
        for(var i=0;i<width;i++){
          await board.react(colEmoji[i]);
        }
      }
      react(width);
    });
  }else if(eventType == "messageReactionAdd"){
    var board = msg.message.embeds[0].description.split("\n")
    var index = colEmoji.indexOf(msg._emoji.name);
    if(index < 0){
      return false;
    }
    var currentRow = board.length-2;
    var loc = 0;
    while(currentRow>=2){
      loc = 0;
      var currentCol = 0;
      while(currentCol < index){
        if(board[currentRow][loc] == "⚫"){
          loc++;
        }else{
          loc+=2;
        }
        currentCol++;
      }
      console.log(loc + " " + currentCol)
      if(board[currentRow][loc] == "⚫"){
        break;
      }

      currentRow--;
    }

    if(currentRow < 2){
      return;
    }

    var regExp = /\d{17,18}/;
    var lastPlayer = regExp.exec(msg.message.content)[0];
    var nextPlayer = regExp.exec(msg.message.embeds[0].description.substring(msg.message.embeds[0].description.indexOf(lastPlayer)+lastPlayer.length))
    if(!nextPlayer){
      nextPlayer = regExp.exec(msg.message.embeds[0].description);
    }

    var currentPieceLoc = msg.message.embeds[0].description.match(/\d{17,18}/g).indexOf(lastPlayer);
    board[currentRow] = board[currentRow].substr(0,loc) + playerFaces[currentPieceLoc] + board[currentRow].substr(loc+1)
    msg.message.embeds[0].description = board.join("\n")
    msg.message.embeds[0]//I have no clue why but the program breaks if this line is not here

    currentPieceLoc++;
    console.log(msg.message.embeds[0].description.match(/\d{17,18}/g))
    if(currentPieceLoc>=msg.message.embeds[0].description.match(/\d{17,18}/g).length){
      currentPieceLoc=0;
    }
    +new Date
    msg.message.embeds[0].footer.text = "Game Length: "+Math.round((Date.now()-msg.message.createdTimestamp)/1000/60)+"min";
    msg.message.edit("Playing connect 4: "+playerFaces[currentPieceLoc]+"<@"+nextPlayer[0]+">'s turn", new Discord.RichEmbed(msg.message.embeds[0]));
  }
}
