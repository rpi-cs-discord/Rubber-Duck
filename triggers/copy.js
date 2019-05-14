var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config){
  if(eventType == "message"){
    if(msg.author.bot){return false;}
  }else if(eventType == "messageUpdate"){
  }else{
    return false;
  }
  // if(msg.author.bot){ return false; }
  // if(client.user.id != config.ids.rd_id){ return false; }
  // if(msg.channel.type != "dm"){ return false; }
  if(msg.channel.type == "dm"){return;}
  if(msg.channel.id == "529143391552798720"){return;}
  if(msg.channel.id == "535583850210918420"){return;}
  if(msg.channel.id == "565282451749076993"){return;}

  return true;
}

exports.run = function(eventType, client, msg, config, newMsg){
  //This needs a lot of work
  return true;

  var extra = "";
  if(eventType == "messageUpdate"){
    msg = newMsg;
    extra = " (EDITED)";
  }
  var copyServerId = "439858181083234314" // id of server messages are copied to
  var COPYSERVER = client.guilds.get(copyServerId);

  if(msg.channel.guild.id == process.env.DEFAULT_SERVER) {
    var theUserName = msg.author.username;
    if(msg.guild.members.get(msg.author.id).nickname){theUserName += " (" + msg.guild.members.get(msg.author.id).nickname+")"}
    theUserName +=' (' + msg.author.id + ')';

    var theMsg = msg.cleanContent;
    msg.mentions.members.forEach(function(member){
      theMsg += " TAGGED: " + member.user.id
    })

    var attachment_urls = []
    msg.attachments.forEach(attachment => {
      attachment_urls.push(attachment.url);
    });

    var copy_association = client.archive_associations.find(association => association.original == msg.channel.id);
    if (copy_association == undefined) {
      // Check for the parent
      var parent_association = client.archive_associations.find(association => association.original == msg.channel.parent.id);
      if (parent_association == undefined) {
        COPYSERVER.createChannel(msg.channel.parent.name, 'category').then(new_category => {
          client.archive_associations.push({original: msg.channel.parent.id,
                                                  copy: new_category.id
                                                 });
          COPYSERVER.createChannel(msg.channel.name, 'text').then(new_channel => {
            client.archive_associations.push({original: msg.channel.id,
                                                    copy: new_channel.id
                                                   });
            new_channel.setParent(new_category);
            new_channel.send(theUserName + extra + ": " + theMsg, {files: attachment_urls});
            fs.writeFileSync('archive-channels.json', JSON.stringify(client.archive_associations), 'utf8');
          });
        });
      }
      else {
        COPYSERVER.createChannel(msg.channel.name, 'text').then(new_channel => {
          client.archive_associations.push({original: msg.channel.id,
                                                  copy: new_channel.id
                                                 });
          new_channel.setParent(COPYSERVER.channels.get(parent_association.copy));
          new_channel.send(theUserName + extra + ": " + theMsg, {files: attachment_urls});
          fs.writeFileSync('archive-channels.json', JSON.stringify(client.archive_associations), 'utf8');
        });
      }
    }
    else {
      //console.log(copy_association)
      //console.log(copy_association.copy)
      COPYSERVER.channels.get(copy_association.copy).send(theUserName + extra + ": " + theMsg, {files: attachment_urls});
    }
  } else if(extra === "" && msg.channel.guild.id == copyServerId && !msg.author.bot && msg.channel.id != process.env.BENS_SECRET_RUBBER_DUCK_DEBUGGING){
    var msgToSend = msg.content;
    var usingRubberDuck = true;
    if(!(msgToSend.startsWith("rd ") || msgToSend.startsWith("rm "))){
      msg.channel.send('ERROR: You forgot to add the command. Please use "rd" or "rm"');
      return;
    }else{
      if(msgToSend.startsWith("rm ")){
         usingRubberDuck = false;
      }
      msgToSend=msgToSend.slice(3);//This number is the length of the command plus the space (both commands are the same length)
    }
    //this code allowes us to speak as the ducks
    var id = client.archive_associations.find(association => association.copy == msg.channel.id);
    if(id == undefined){
      msg.channel.send("ERROR: Unable to find chat.");
      return true;
    } else {
      id = id.original
    }

    //check for user tags and make them work
    var getUser  = /\@\d{18}\b/;
    msgToSend = msgToSend.replace(getUser, function(theString){
      return "<" + theString + ">";
    })

    var getUserNoId  = /@(.*?)~/g
    msgToSend = msgToSend.replace(getUserNoId, function(theName){
      var users = client.guilds.get(process.env.DEFAULT_SERVER).members.array()
      var theName2 = theName.substring(0, theName.length - 1);
      for(var i=0;i<users.length;i++){
        if("@" + users[i].nickname == theName2 || "@" + users[i].user.username == theName2){
          //console.log("<@" + users[i].id + ">");
          return "<@" + users[i].id + ">";
        }
      }

      return theName2;
    })

    //send message
    if(usingRubberDuck){
      delaySend(client, null, msgToSend, 1000, id);
    }else{
      // delaySend(roboMallard, null, msgToSend, 1000, id);
    }
  }
}
