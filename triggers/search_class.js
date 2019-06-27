var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config, user){
  if(eventType == "message"){
    if(msg.author.bot){ return false; }
    if(msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id){ return false; }
    if(client.user.id != config.user_ids.rd_id){ return false; }
    // if(msg.channel.type != "dm"){ return false; }
    if(msg.content.toLowerCase() == "!add"){return false;}
    if(!msg.content.toLowerCase().startsWith("!add")){ return false; }
    return true;
  }else if(eventType == "messageReactionAdd"){
    if(user.bot){ return false; }
    if(msg.message.channel.type != "dm" && msg.message.channel.guild.id != config.default_server.id){ return false; }
    if(client.user.id != config.user_ids.rd_id){ return false; }
    if(msg.message.author.id != config.user_ids.rd_id){return false;}
    if(!msg.message.content.includes("could not find an exact match for")){return false;}

    return true;
  }
  return false;
}



var Fuse = require('fuse.js');
const fs = require("fs");
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var options = {
  shouldSort: true,
  findAllMatches: true,
  includeScore: true,
  threshold: 1,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "roleName",
    "department",
    "courseCode",
    "abbreviations"
  ]
};
var fuse = new Fuse(config.addable_roles, options); // "list" is the item array

const emojiNumbers = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"]
const noMatchingResultsEmote = "🚫";
exports.run = function(eventType, client, msg, config, database, user){
  var server = client.guilds.get(config.default_server.id);

  if(eventType == "message"){
    if(msg.channel.type == "dm" || triggerUtils.isValidChannel(msg.channel.id, config.role_management.valid_channel_ids)){
      var searchTerm = triggerUtils.textAfterGap(msg.content);
      var results = fuse.search(searchTerm);

      var shownResultsLength = Math.min(results.length, config.role_management.max_search_results)
      shownResultsLength = Math.min(shownResultsLength, emojiNumbers.length);

      if(results.length == 0){
        msg.channel.send("No Results found for your search: " + searchTerm)
      }else if((results.length>=2 && results[0].score == 0 && results[1].score != 0)
       || results.length==1  && results[0].score == 0){

        addRole(server, msg, msg.author, results[0].item.roleName)
      }else{
        msg.channel.send("Searching...").then(function(botMsg){
          async function react() {

            msgToSend  = "<@" + msg.author.id + ">, I could not find an exact match for `" + searchTerm + "`\n";
            msgToSend += "Click the corresponding reaction if one of these results match:\n"//, or send the number of the correct result
            msgToSend += "\n"
            for (let i = 0; i < shownResultsLength; i++) {
              msgToSend+=emojiNumbers[i] //+ " " + results[i].item.department + "-" + results[i].item.courseCode + " " + results[i].item.roleName + " " + results[i].score + "\n\n";
              if(results[i].item.department && results[i].item.courseCode){
                msgToSend+=" " + results[i].item.department + "-" + results[i].item.courseCode
              }
              msgToSend+=" " + results[i].item.roleName
              msgToSend+= "\n\n";
            }
            msgToSend += noMatchingResultsEmote + " No results match";
            botMsg.edit(msgToSend);

            for (let i = 0; i < shownResultsLength; i++) {
              await botMsg.react(emojiNumbers[i]);
            }
            await botMsg.react(noMatchingResultsEmote);
          }
          react();
        });
      }
    }else{
      msg.channel.send(config.role_management.anti_spam_message);
    }
  }else if(eventType == "messageReactionAdd"){
    var re = /[0-9]{18}|[0-9]{17}/;
    if(user.id != re.exec(msg.message.content)){//wrong user reacting
      user.send("It looks like you tried to add a course that another user searched for. This however is not a supported way of adding a course. \nIf you still want to add that course feel free to use `!add COURSE NAME`")
      msg.remove(user);
      return;
    }
    if(msg._emoji.name == noMatchingResultsEmote){//reacted with the nothing found emote
      triggerUtils.delaySend(client, msg.message, "It looks like I could not find the class you are looking for. You may want to double check it exists using `!classes` or message one of the server mods and ask.", 500);
      msg.message.clearReactions();
      return;
    }

    var re = new RegExp("("+msg._emoji.name+" )(([a-zA-Z]+)-([0-9]+)(\/[0-9]+)? )?(.+)");
    if(!re.exec(msg.message.content) || msg.count<2){//cannot add extra unrelated reactions
      msg.remove(user);
      return;
    }
    var matches = re.exec(msg.message.content);
    var roleToAdd = findByCourseRole(matches[6]);
    msg.message.clearReactions();
    setTimeout(function () {
      msg.message.clearReactions();
    }, 5000);

    addRole(server, msg.message, user, roleToAdd.roleName)
  }
}

function findByCourseRole(roleName){
    for (var i=0; i < config.addable_roles.length; i++) {
        if (config.addable_roles[i].roleName == roleName) {
            return config.addable_roles[i];
        }
    }
}

function addRole(server, msg, user, roleName){
  // server.members.get(user.id).addRole(server.roles.find(role => role.name === roleName).id)
  msg.guild.fetchMembers().then(function(a){
    a.members.get(user.id).addRole(server.roles.find(role => role.name === roleName).id)
    msg.channel.send('You have been added to the class "' + roleName + '"');
  });
}
