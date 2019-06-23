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

var blackCircleEmoji = "⚫";
var playerFaces = ["😄","😡","👿","🤢","💀","🤖","🐵","🐷"];
var colEmoji = ["0⃣","1⃣","2⃣","3⃣","4⃣","5⃣","6⃣","7⃣","8⃣","9⃣","🔟","🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭","🇮"]
var width = 15;
if(width > 20){width=20;}
var height = 10;
exports.run = function(eventType, client, msg, config, database, user){
  if(eventType == "message"){
    if(msg.channel.type == "dm" || triggerUtils.isValidChannel(msg.channel.id, config.games.valid_channel_ids)){
    }else{
      return false;
    }

    var titleText = "";
    titleText += playerFaces[0]
    titleText += msg.guild.members.get(msg.author.id).user
    for(var i=0;i<msg.mentions.members.array().length && i<playerFaces.length-1;i++){
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
        board += blackCircleEmoji;
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
    msg.remove(user);
    var board = msg.message.embeds[0].description.split("\n")
    // msg.message.channel.send(emojiAtSpot(board[board.length-2],2))
    var index = colEmoji.indexOf(msg._emoji.name);
    if(index < 0){
      return false;
    }
    var currentRow = board.length-2;
    var loc = 0;
    while(currentRow>=2){
      loc = getSpot(board[currentRow], index)
      if(board[currentRow][loc] == blackCircleEmoji){
        break;
      }
      currentRow--;
    }

    if(currentRow < 2){
      return;
    }

    var regExp = /\d{17,18}/;
    var lastPlayer = regExp.exec(msg.message.content)[0];
    console.log(user.id)

    // uncomment this code to limit playing out of turn
    if(user.id != lastPlayer){
      return;
    }

    var nextPlayer = regExp.exec(msg.message.embeds[0].description.substring(msg.message.embeds[0].description.indexOf(lastPlayer)+lastPlayer.length))
    if(!nextPlayer){
      nextPlayer = regExp.exec(msg.message.embeds[0].description);
    }
    // msg.message.channel.send("<@"+nextPlayer[0]+">").then(function(sentMsg){
    //   sentMsg.delete();
    // })

    var currentPieceLoc = msg.message.embeds[0].description.match(/\d{17,18}/g).indexOf(lastPlayer);
    board[currentRow] = board[currentRow].substr(0,loc) + playerFaces[currentPieceLoc] + board[currentRow].substr(loc+1)
    msg.message.embeds[0].description = board.join("\n")
    msg.message.embeds[0]//I have no clue why but the program breaks if this line is not here

    currentPieceLoc++;
    // console.log(msg.message.embeds[0].description.match(/\d{17,18}/g))
    if(currentPieceLoc>=msg.message.embeds[0].description.match(/\d{17,18}/g).length){
      currentPieceLoc=0;
    }
    +new Date
    msg.message.embeds[0].footer.text = "Game Length: "+Math.round((Date.now()-msg.message.createdTimestamp)/1000/60)+"min";

    var msgText = "Playing connect 4: "+playerFaces[currentPieceLoc]+"<@"+nextPlayer[0]+">'s turn"
    var gameOver = checkGameOver(board, currentRow, index);
    if(gameOver == 1){
      msgText = "<@"+user.id+"> Wins!";
    }else if(gameOver == -1){
      msgText = "Tie Game";
    }

    msg.message.edit(msgText, new Discord.RichEmbed(msg.message.embeds[0]));
  }
}


function getSpot(row, index){
  var loc = 0;
  var currentCol = 0;
  while(currentCol < index){
    if(row[loc] == blackCircleEmoji){
      loc++;
    }else{
      loc+=2;
    }
    currentCol++;
  }
  return loc;
}

function emojiAtSpot(row, index){
  var loc = getSpot(row,index);
  if(row[loc] == blackCircleEmoji){
    return blackCircleEmoji;
  }else{
    return playerFaces.find(function(element){
      if(element == row[loc] + row[loc+1]){
        return true;
      }
    });
  }
}

function checkGameOver(board, row, col){
  var emojiToCheck = emojiAtSpot(board[row], col);
  // console.log(row + " " + col)

  var hasWon = true;
  for(var i=row+1; i<row+1+3; i++){
    if(i>board.length-2){
      hasWon = false;
      break;
    }
    if(emojiAtSpot(board[i], col) != emojiToCheck){
      hasWon = false;
      break;
    }
    // console.log(board[i] + " " +col)
  }
  if(hasWon){console.log("c");return 1;}

  var numInARow = 1;
  var i = col;
  while(i > 0){
    i--;
    if(emojiAtSpot(board[row], i) == emojiToCheck){
      // console.log(emojiToCheck + " " + emojiAtSpot(board[row], i))
      numInARow++
    }else{
      break;
    }
  }
  i=col;
  while(i < width-1){
    i++;
    if(emojiAtSpot(board[row], i) == emojiToCheck){
      numInARow++;
    }else{
      break;
    }
  }
  if(numInARow >=4 ){console.log("a");return 1;}

  numInARow = 1;
  var x = col;
  var y = row;
  while(x > 0 && y > 2){
    x--;
    y--;
    if(emojiAtSpot(board[y], x) == emojiToCheck){
      numInARow++
    }else{
      break;
    }
  }
  x=col;
  y=row;
  // console.log(col + ","+row + " " + width +" " + height)
  while(x < width-1 && y < height+3){
    x++;
    y++;
    if(emojiAtSpot(board[y], x) == emojiToCheck){
      numInARow++;
    }else{
      break;
    }
  }
  if(numInARow >=4 ){console.log("b");return 1;}

  numInARow = 1;
  x = col;
  y = row;
  while(x > 0 && y < height+3){
    x--;
    y++;
    if(emojiAtSpot(board[y], x) == emojiToCheck){
      numInARow++
    }else{
      break;
    }
  }
  x=col;
  y=row;
  while(x < width-1 && y > 2){
    x++;
    y--;
    if(emojiAtSpot(board[y], x) == emojiToCheck){
      numInARow++;
    }else{
      break;
    }
  }
  if(numInARow >=4 ){console.log("c");return 1;}


  for(var i=0;i<width;i++){
    if(emojiAtSpot(board[2], i) == blackCircleEmoji){
      return 0;
    }
  }

  return -1;
}
