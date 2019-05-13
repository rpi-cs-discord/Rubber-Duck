//test4
require('dotenv').config();
//Keeps the bot alive on glitch.com
const http = require('http');
const express = require('express');
var fs = require('fs');
var request = require('request');
var schedule = require('node-schedule');
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen("3000");
setInterval(() => {
  http.get('http://rubber-ducks-git-pull.glitch.me/');
}, 120000);

app.post('/pull-git', function(request, response) {
  response.send("ok")//this line is needed
  console.log("Told to pull")
  git_pull();
});

app.get('/pull-git', function(request, response) {
  response.send("ok")//this line is needed
});

function git_pull(){
  const { exec } = require('child_process');
  exec('cd Rubber-Duck && git fetch --all && git reset --hard origin/master && refresh && ./package-json-update.sh', (err, stdout, stderr) => {
    if(err){return;}
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}


var request = require('request');

var rd_id = process.env.RD_ID;
var rm_id = process.env.RM_ID;

//General code for both bots
const Discord = require('discord.js');
const rubberDuck = new Discord.Client();
const roboMallard = new Discord.Client();

rubberDuck.login(process.env.RD_TOKEN);
roboMallard.login(process.env.RM_TOKEN);

rubberDuck.archive_associations =  JSON.parse(fs.readFileSync('./archive-channels.json', 'utf8'));

var database;
fs.readFile("./database.json", 'utf8', function(err, contents) {
  database = JSON.parse(contents);

  emojiOnlyServers = database.emojiOnlyServers;
})

function saveDatbase(){
  fs.writeFile("./database.json", JSON.stringify(database), function(err, contents) {
  })
}

//Rubber Duck on ready
rubberDuck.on('ready', () => {
  console.log('Rubber Duck Online')
  rubberDuck.user.setActivity('std::code() \\*View code*\\', {
    type: 'playing'
  })
  //rubberDuck.guilds.get(process.env.DEFAULT_SERVER).members.forEach(member => console.log(member.id));
  // .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
  //.catch(console.error);


  // var server = rubberDuck.guilds.get(process.env.DEFAULT_SERVER);
  // // console.log(server.members[0])
  // for (var member in server.members)
  //       console.log(member)

});

//Robo Mallard on ready
roboMallard.on('ready', () => {
  console.log('Robo Mallard Online')
  roboMallard.user.setActivity('');
});

//Rubber Duck on message
rubberDuck.on('message', msg => {
  if(bothMessageReceived(msg, rubberDuck)){return true;}
  rubberDuckMessageRecieved(msg);
});

rubberDuck.on('messageUpdate', (oldmes,newmes) => {
  copyMessage(rubberDuck,newmes," (EDITED)");

  if(emojimode(rubberDuck,newmes)){return true;}
  if(removeEcho(oldmes)){return true;}
});

//Robo Mallard on message
roboMallard.on('message', msg => {
  if(bothMessageReceived(msg, roboMallard)){return true;}
  roboMallardMessageRecieved(msg);
});

rubberDuck.on('messageDelete', msg => {
  if(removeEcho(msg)){return true;}
});

function removeEcho(msg){
  if(msg.content.startsWith("!echo") || msg.content.startsWith("!translate")){
    msg.channel.fetchMessages({"after":msg.id, "limit":10})
    .then(messages => {
      messages.forEach(function(msg2){
        if(msg2.author.bot && msg2.content.startsWith(msg.content.substring(msg.content.indexOf(' ') + 1).trim())){
          msg2.delete();
          return true;
        }
      })
    });
  }
}

//code that runs for both ducks on a message being sent
function bothMessageReceived(msg, botClient){
  // if(sendMessagAsBot(msg, botClient)){return true;}
}

// http://damour.me/regionalIndicatorConverter
var reactions = {
  "school of computing": ["🇨", "🇴", "🇲", "🇵", "🇺", "🇹", "🇮", "🇳", "🇬"],
  "arch": ["565762428122562560"]
};

//code that runs just rubber duck on a message being sent
function rubberDuckMessageRecieved(msg){
  copyMessage(rubberDuck,msg,""); // must be first


  if(updateBot(rubberDuck,msg)){return true;}
  if(emojimode(rubberDuck,msg)){return true;}
  if(latexGet(rubberDuck,msg)){return true;}
  if(latexGet2(rubberDuck,msg)){return true;}
  if(newClassMaker(msg)){return true;}
  if(addRoles(rubberDuck,msg)){return true;}
  if(getMan(rubberDuck,msg)){return true;}
  if(minecraft(rubberDuck,msg)){return true;}
  if(translate(rubberDuck,msg)){return true;}

  for (var text in reactions) {
    if (msg.content.toLowerCase().includes(text)) {
      async function react() {
        for (var i = 0; i < reactions[text].length; ++i) {
          await msg.react(reactions[text][i]);
        }
      }
      react();
      return true;
    }
  }

  if (msg.content.toLowerCase().startsWith('!academic integrity') || msg.content.toLowerCase().startsWith('!ai')) {
    delaySend(rubberDuck,msg,"Please do not share any class related code on this server.  If you see any code please PM an admin to have it removed. \nAlso make sure you are following the Academic Integrity as stated on page 16 of the Student Handbook: https://info.rpi.edu/sites/default/files/Rensselaer%20Handbook%20of%20Student%20Rights%20%26%20Responsibilities%20%C2%BB.pdf" ,1000);
    return true;
  }

  if (msg.content.toLowerCase() == 'std::code()') {
    delaySend(rubberDuck,msg,"expected ';' after 'code'" ,1000);
    return true;
  }

  if (msg.content.toLowerCase() == 'std::code;' || msg.content.toLowerCase() == 'std::code') {
    delaySend(rubberDuck,msg,"statement is a reference, not call, to function 'code' [-Waddress]" ,1000);
    return true;
  }

  if (msg.content.toLowerCase() == 'std::code();' || msg.content.toLowerCase() == '!code' || msg.content.toLowerCase().startsWith('std::code();')) {
    var messageText = 'My code can be found here: <https://github.com/rpi-cs-discord/Rubber-Duck> \nFeel free to add issues to the issue tracker, or even submit pull requests. Also while you are there why not give us a star. \nRubber Duck is courtesy of "Eli#8092" and "Phi11ipus#4667". If you find any bugs or have a feature suggestion feel free to send one of them a PM.';
    delaySend(rubberDuck,msg,messageText,1000);
    return true;
  }

  // quack back at somebody code
  var rdd_id = process.env.RDD_ID;
  if((msg.channel.id == rdd_id || msg.channel.id == process.env.BENS_SECRET_RUBBER_DUCK_DEBUGGING || msg.channel.type == "dm" || msg.content.toLowerCase().includes("<@" + rd_id + ">")) && !msg.author.bot){
    sendQuack(rubberDuck,msg);
  }
}

//code that runs just Robo Mallard on a message being sent
function roboMallardMessageRecieved(msg){
  if ((msg.content.toLowerCase() == 'std::code();' || msg.content.toLowerCase() == '!code') && Math.random()>.7) {
    var messageText = 'Hold up, my code can also be found at that link... Stop trying to take credit for all my hard work!';
    delaySend(roboMallard,msg,messageText,2000);
    return true;
  }
  if(!emojiOnlyServers[msg.channel.id] || msg.author.id==process.env.ELI_ID || msg.author.id==process.env.BEN_ID){
    if (msg.content.toLowerCase().startsWith("!echo ")) {
      if (!msg.author.bot) {
        delaySend(roboMallard, msg, msg.content.substring(6), 1000);
        return true;
      }
    } else if (msg.channel.type == "dm" && !msg.author.bot && Math.random() > .8) {
      sendQuack(roboMallard,msg);
    }
  }

}


function updateBot(rubberDuck,msg){
  if (msg.content.toLowerCase() == '!update' && (msg.author.id == process.env.ELI_ID || msg.author.id == process.env.BEN_ID)){
    msg.channel.send("Updating the bot, this may take a few seconds please stand by.");
    git_pull();
    return true;
  }
}

//msg = the message object
//messageText = the text you want to be sent
//delay = time in ms to wait before sending
//botClient = the bot that that message will be sent from
//chatID (optional) = a specific chat other than msg that you want to send to
function delaySend(botClient, msg, messageText, delay, chatID){
  if(msg){var theChannel = botClient.channels.get(msg.channel.id);}
  if(chatID){theChannel = botClient.channels.get(chatID);}

  theChannel.startTyping();
  setTimeout(function(){
    theChannel.send(messageText);
  }, delay);
  theChannel.stopTyping();
}

//sends a quack
var quacks = JSON.parse(fs.readFileSync('./Rubber-Duck/quacks.json', 'utf8'));//load in quacks from json file
function sendQuack(botClient, msg){
  var messageText = quacks.generic_quacks[Math.floor(Math.random() * quacks.generic_quacks.length)];
  // messageText = "psyduck"
  delaySend(botClient,msg,messageText,1000);
}

//set time task
// schedule.scheduleJob('0 0 4 * * 5', function(){
//   rubberDuck.channels.get("486600474733314058").send("@here One hour remaining! Make sure to submit at least something just in case you lose track of time.")
// });
// schedule.scheduleJob('0 55 4 * * 5', function(){
//   var date = new Date();
//   console.log("5 minutes remaining");
//   rubberDuck.channels.get("486600474733314058").send("@here 5 minutes remaining")
// });
// midnightCountdown(5, "@here FINISHED! I hope everyone got their homework in on time!", "486600474733314058", rubberDuck);

function midnightCountdown(endDayOfWeek, endText, channelID, botClient){
  // sunday == 1
  var time = ' 59 4 * * ' + endDayOfWeek; // make sure time does not have seconds on it but does have space at start

  schedule.scheduleJob(59+time, function(){botClient.channels.get(channelID).startTyping();});
  for(let i=0;i<10;i++){
    schedule.scheduleJob(59-i+time, function(){botClient.channels.get(channelID).send((i+1))});
  }

  time = '0 0 5 * * ' + endDayOfWeek;
  schedule.scheduleJob(time, function(){
    botClient.channels.get(channelID).send(endText);
    botClient.channels.get(channelID).stopTyping();
  });
}




function copyMessage(rubberDuck,msg,extra){
  if(msg.author.bot){return;}
  if(msg.channel.type == "dm"){return;}
  if(msg.channel.id == "529143391552798720"){return;}
  if(msg.channel.id == "535583850210918420"){return;}
  if(msg.channel.id == "565282451749076993"){return;}


  var copyServerId = "534134027280580632" // id of server messages are copied to
  var COPYSERVER = rubberDuck.guilds.get(copyServerId);

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

    var copy_association = rubberDuck.archive_associations.find(association => association.original == msg.channel.id);
    if (copy_association == undefined) {
      // Check for the parent
      var parent_association = rubberDuck.archive_associations.find(association => association.original == msg.channel.parent.id);
      if (parent_association == undefined) {
        COPYSERVER.createChannel(msg.channel.parent.name, 'category').then(new_category => {
          rubberDuck.archive_associations.push({original: msg.channel.parent.id,
                                                  copy: new_category.id
                                                 });
          COPYSERVER.createChannel(msg.channel.name, 'text').then(new_channel => {
            rubberDuck.archive_associations.push({original: msg.channel.id,
                                                    copy: new_channel.id
                                                   });
            new_channel.setParent(new_category);
            new_channel.send(theUserName + extra + ": " + theMsg, {files: attachment_urls});
            fs.writeFileSync('archive-channels.json', JSON.stringify(rubberDuck.archive_associations), 'utf8');
          });
        });
      }
      else {
        COPYSERVER.createChannel(msg.channel.name, 'text').then(new_channel => {
          rubberDuck.archive_associations.push({original: msg.channel.id,
                                                  copy: new_channel.id
                                                 });
          new_channel.setParent(COPYSERVER.channels.get(parent_association.copy));
          new_channel.send(theUserName + extra + ": " + theMsg, {files: attachment_urls});
          fs.writeFileSync('archive-channels.json', JSON.stringify(rubberDuck.archive_associations), 'utf8');
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
    var id = rubberDuck.archive_associations.find(association => association.copy == msg.channel.id);
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
      var users = rubberDuck.guilds.get(process.env.DEFAULT_SERVER).members.array()
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
      delaySend(rubberDuck, null, msgToSend, 1000, id);
    }else{
      delaySend(roboMallard, null, msgToSend, 1000, id);
    }
  }
}

// IMPORTANT: ADD CLASSES IN ALPHABETICAL ORDER
var classRoles = ["Freshman","Sophomore","Junior","Senior","Grad Student","Alumnus","Non-RPI",".","Advanced Computer Graphics","Algorithmic Robotics","Beginning Programming for Engineers","Cognitive Modeling I","Comp Org","Computational Biology","Computational Optimization","Computer Science 1","Data Analytics","Data and Society","Database Systems","Design and Analysis of Algorithms","Distributed Computing Over The Internet","DS","Economics and Computation","FOCS","Game Development II","Integer and Combinatorial Optimization","Intro Algo","Introduction to Data Mathematics","Intro to AI","Intro to Computer Programming","Intro to Network Science", "Large-Scale Matrix Comp & ML","MBE", "NLP","NumComp","OpSys","OSS","Parallel Programming","Principles of Program Analysis","PSoft","Readings in Computer Science","Readings in CSCI","Selmer","SD&D","Software Verification","Times Series Analysis","Web Science Systems Dev","Xinformatics"]//must match name exactly
function addRoles(rubberDuck,msg){
  var server = rubberDuck.guilds.get(process.env.DEFAULT_SERVER);

  if(msg.channel.type == "dm"){
    //console.log(msg.author.name + ": " + msg.content)
    if(msg.content.toLowerCase() == "!help"){
      msg.channel.send(
                        'To view the available classes type "!classes"\n'
                      + 'To add a class type "!add **[CLASS NAME]**"\n'
                      + 'To remove a class type "!remove **[CLASS NAME]**"\n'
                      + 'To view the chats for all classes type "!add All-Seer"\nYou can remove this ability with "!remove All-Seer'
                      + '\nDont forget to also view our rules with "!rules"\n'
                      + 'TAs, Mentors and ALAC tutors should PM "Eli#8092" or "Phi11ipus#4667" to get verified\n'
                      + 'Also if you want to view my code just type !code'
                      );
      return true;
    }

    if(msg.content.toLowerCase() == "!rules"){
      msg.channel.send(
                        'Be nice, don\'t cheat, and most importantly:\nQuack'
                      );
      return true;
    }


    if(msg.content.startsWith("!classes")){
      var roleNames = "**";
      for(var i=0;i<classRoles.length;i++){
        roleNames += server.roles.find(role => role.name === classRoles[i]).name
        if(i<classRoles.length-1){roleNames+="\n";}
      }
      roleNames += "**";
      var embedObj = {embed: {
        color: 3447003,
        // description: roles
      }}
      embedObj.embed.description = roleNames;
      msg.channel.send(embedObj);
      msg.channel.send('Don\'t forget to see the chats for all classes you can also add "**All-Seer**"');
      msg.channel.send('If you are in a class which is not listed above, please message "@Eli#8092" or "Phi11ipus#4667".');
      return true;
    }

    if(msg.content.toLowerCase() == "!add all-seer"){
      msg.channel.send('You are now an All-Seer. But remember, with great power comes great responsibility and a lot of notifications!\nAlso, even as an All-Seer, please keep your class list up to date to let others know which classes you are enrolled in.\nIf you don\'t want to be an All-Seer anymore, just type "!remove All-Seer"');
      server.members.get(msg.author.id).addRole(server.roles.find(role => role.name === "All-Seer").id)
      return true;
    }
    if(msg.content.toLowerCase() == "!remove all-seer"){
      msg.channel.send('You are no longer an All-Seer.');
      server.members.get(msg.author.id).removeRole(server.roles.find(role => role.name === "All-Seer").id)
      return true;
    }

    if(msg.content.startsWith("!add ")){
      var roleName = msg.content.substring(msg.content.indexOf(' ') + 1).toLowerCase()
      for(var i=0;i<classRoles.length;i++){
        if(classRoles[i].toLowerCase() == roleName){
          // todo add message if they already have that role
          //console.log(msg.author.id)
          msg.channel.send('You have been added to the class "' + classRoles[i] + '"');
          server.members.get(msg.author.id).addRole(server.roles.find(role => role.name === classRoles[i]).id)
          return true;
        }
      }
      msg.channel.send('I cannot find **' + roleName + '**, double check your spelling and try again. If this is a CS class at RPI but it is not in the current list of classes please message "@Eli#8092" or "Phi11ipus#4667".');
      return true;
    }

    if(msg.content.startsWith("!add")){
      msg.channel.send('Use this command to add a role for any class you are currently in for example:\n`!add DS`');
    }

    if(msg.content.startsWith("!remove ")){
      var roleName = msg.content.substring(msg.content.indexOf(' ') + 1).toLowerCase();
      for(var i=0;i<classRoles.length;i++){
        if(classRoles[i].toLowerCase() == roleName){
          // todo add message if they already have that role
          msg.channel.send('You have been removed from the class "' + classRoles[i] + '"');
          server.members.get(msg.author.id).removeRole(server.roles.find(role => role.name === classRoles[i]).id)
          return true;
        }
      }
      msg.channel.send('Could not find a class named "' + roleName + '"');
      return true;
    }

    if(msg.content.startsWith("!remove")){
      msg.channel.send('Use this command to remove a class role you are currently assigned to for example:\n`!remove DS`');
    }
  }else{
    if(msg.content.toLowerCase() == "!help" || msg.content.startsWith("!remove") || msg.content.startsWith("!add") || msg.content.startsWith("!classes") || msg.content.startsWith("!rules")){
      msg.channel.send('To limit spam that command only works in a PM to me');//To limit spam that command only works in a PM to me
    }
  }
}

rubberDuck.on("presenceUpdate", (oldMember, newMember) => {
    if(oldMember.presence.status !== newMember.presence.status){
      let roles = newMember.roles.array();
      let valid = true;
      for (let i=0; i<roles.length; i++) {
         if (roles[i].name == "~") {
          valid = false;
           break;
        }
      }

      if (valid) rubberDuck.channels.get('534135329058324482').send(newMember.user.username + ' (' + newMember.id +')' + ' is now ' + newMember.presence.status )
    }
});

rubberDuck.on('guildMemberAdd', member => {
//   var messageText = "Hi there! Welcome to the RPI Computer Science Discord Server. As you might’ve noticed, things look a little empty over there! Let’s fix that by giving you some class specific roles.\n"
//                   + 'To add a class, please message me "!add **CLASS NAME**".  The available classes are:';

//   for(var i=0;i<classRoles.length;i++){
//     messageText += " " + classRoles[i]
//     if(i+1<classRoles.length){ messageText +=  ","; }
//   }

//   messageText += '\nAlso to remove a class, please message me "!remove **CLASS NAME**".'
//   messageText += '\nIf you have any questions feel free to message in the general chat or PM one of the admins, also to view the commands again type **"!help"**.\nOnce again, welcome!'
   var server = rubberDuck.guilds.get(process.env.DEFAULT_SERVER);
  var roleNames = "**";
      for(var i=0;i<classRoles.length;i++){
        roleNames += server.roles.find(role => role.name === classRoles[i]).name
        if(i<classRoles.length-1){roleNames+="\n";}
      }
      roleNames += "**";
      var embedObj = {embed: {
        color: 3447003,
        // description: roles
      }}
      embedObj.embed.description = roleNames;


      var messageText = "Hi there! Welcome to the RPI Computer Science Discord Server. As you might’ve noticed, things look a little empty over there! Let’s fix that by giving you some class specific roles.\n"
                  + 'To add a class, please message me `!add CLASS NAME`.  (You can view the list of classes below or with the command `!classes`)';


  messageText += '\nTo remove a class, please message me `!remove CLASS NAME`.'
  messageText +='\nIf you want to see the chats for all classes you can also `!add All-Seer`'
  messageText += '\nIf you have any questions feel free to message in the random/welcome chats or PM one of the admins, also to view the commands again type `!help`.\nOnce again, welcome!'





  member.send(messageText);
  member.send(embedObj);
  delaySend(rubberDuck, null, "Welcome <@" + member.id + ">! Make sure to check your PM for how to view private class-specific chats.",1000, "528998098274484254");
  //console.log(member.id);
});

function newClassMaker(msg){
  if (msg.author.id == process.env.ELI_ID || msg.author.id == process.env.BEN_ID) {
    if (msg.content.startsWith('\\gen_class')) {
      var SERVER = rubberDuck.guilds.get(process.env.DEFAULT_SERVER);

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
      var toCreate = [className, className+" Mentor", className+" TA"];
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
          if (permissionOverwrites.length === 5) {
            GenerateChannels(msg, SERVER, permissionOverwrites, className);
          }
        });
      });

      return true;
    }
  }
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




function latexGet(client, msg){
  // if(msg.channel.id == "535583850210918420" || msg.channel.type == "dm"){}else{return false;}
  if(!(msg.content.startsWith("@tex ") || msg.content.startsWith("$tex")|| msg.content.startsWith("?tex ")|| msg.content.startsWith("#tex ")|| msg.content.startsWith("!tex:")|| msg.content.startsWith("!tex ") || msg.content.startsWith("=tex ")) || msg.content.indexOf(' ') == -1 ){
     return false;
  }

  var number = msg.content.substring(msg.content.indexOf(':') + 1,msg.content.indexOf(' '))
  number = parseInt(number, 10);
  if(isNaN(number)){number = 600;}
  if(number>2000){number=2001;}
  if(number<=0){number=1;}

  request({
    uri: "http://latex2png.com/",
    method: "POST",
    form:{
      latex: msg.content.substring(msg.content.indexOf(' ') + 1),
      res: number,
      color: "FFFFFF",
      x: 62,
      y: 28
    }
  }, function(error, response, body) {
    var myregexp = /latex_(.*)png/;
    var match = myregexp.exec(body);
    msg.channel.send("",{
        file: "http://latex2png.com/output//"+match[0]
    });
  });



  return true;
}

function latexGet2(client, msg){
  // if(msg.channel.id == "535583850210918420" || msg.channel.type == "dm"){}else{return false;}
  if(!(msg.content.startsWith("!tex2"))){
     return false;
  }

  var packages = "\\usepackage{amsmath} \\usepackage{amsthm} \\usepackage{amsfonts} \\usepackage{amssymb} \\usepackage{tikz} \\usepackage{CJKutf8} \\usepackage[utf8]{inputenc}";
  console.log(msg.content.substring(5))
  request({
    uri: "https://quicklatex.com/latex3.f",
    method: "POST",
    form:{
      formula: msg.content.substring(5),
      fcolor: "FFFFFF",//36393f
      fsize: 99+"px",
      mode: 0,
      out: 1,
      remhost: "quicklatex.com",
      preamble: packages,
      errors: 1,
      rnd: 123

    }
  }, function(error, response, body) {
    var myregexp = /https:(.*)png/;
    var match = myregexp.exec(body);
    if(match[0] == "https://quicklatex.com/cache3/error.png"){
      msg.channel.send(body.split('\n')[2]);
      return true;
    }
    msg.channel.send("",{
        file: match[0]
    });
    console.log(match[0]);
  });



  return true;
}


function getMan(rubberDuck, msg){
  if (!msg.content.toLowerCase().startsWith("man ") || msg.content.split(" ").length!==2){
      return false;
  }
  var page = msg.content.substring(msg.content.indexOf(' ') + 1);
  page = encodeURIComponent(page);

  var request = require("request")
  var url = "https://www.freebsd.org/cgi/man.cgi?query=" + page
  request({
    url: url,
    json: true
  }, function(error, response, body) {
    if(body.includes('Sorry, no data found for') || body.includes('Empty input. Please type a manual page and search again.')){
       return false;
     }else{
       msg.channel.send(url);
      return true;
     }
  })

  return true;
}


var emojiStrip = require('emoji-strip')
var emojiOnlyServers = {};//gets set in database
// emojiOnlyServers["528998098274484254"]=true//#welcome

function emojimode(client, msg){
  if(msg.channel.type == "dm" || msg.author.bot){return false;}

  if(msg.channel.guild.id == process.env.DEFAULT_SERVER || msg.channel.guild.id == "439858181083234314") {//439858181083234314==my bot test server
    if (msg.author.id == process.env.ELI_ID || msg.author.id == process.env.BEN_ID) {
      if (msg.content.toLowerCase() == "!emoji" || msg.content.toLowerCase() == "!emoji-h" || msg.content.toLowerCase() == "!emoji-on" || msg.content.toLowerCase() == "!emoji-off"){
        emojiOnlyServers[msg.channel.id]=!emojiOnlyServers[msg.channel.id]

        var ateveryone = client.guilds.get(msg.channel.guild.id).roles.find(role => role.name === "@everyone")

        if(msg.content.toLowerCase() == "!emoji-on"){
          emojiOnlyServers[msg.channel.id]=true;
          msg.channel.overwritePermissions(ateveryone,{EMBED_LINKS:false})
        }
        if(msg.content.toLowerCase() == "!emoji-off"){
          emojiOnlyServers[msg.channel.id]=false;
          msg.channel.overwritePermissions(ateveryone,{EMBED_LINKS:null})
        }
        saveDatbase();
        if(msg.content.toLowerCase() == "!emoji-h" || msg.content.toLowerCase() == "!emoji-on"  || msg.content.toLowerCase() == "!emoji-off"){
          msg.delete()
          return true;
        }
        if(emojiOnlyServers[msg.channel.id]){
          msg.channel.send("This channel is now in emoji only mode. Your messages must only contain emoji.")
          msg.channel.overwritePermissions(ateveryone,{EMBED_LINKS:false})
        }else{
          msg.channel.send("Emoji Mode has been turned off. You are free to send normal text.")
          msg.channel.overwritePermissions(ateveryone,{EMBED_LINKS:null})
        }
        return true;
      }
    }
    if(emojiOnlyServers[msg.channel.id] && !(msg.author.id==process.env.ELI_ID || msg.author.id==process.env.BEN_ID)){
      console.log(msg.cleanContent)
      if(msg.cleanContent.includes("<<") || msg.embeds.length > 0 || msg.attachments.size > 0){msg.delete(); return true;}
      if(msg.cleanContent.includes("Hold up, my code can also be found at that link")){
        msg.author.send("You sent a message that contained non emoji characters in an emoji only chat. Your message has been removed!")
        msg.delete();
        return true;
      }

      var msgText = msg.cleanContent;
      // console.log(msg.cleanContent);
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
  }
}


// //THIS IS GONNA BE A GREAT MEME
// function unchaos(client) {
//   var server = client.guilds.get(process.env.DEFAULT_SERVER);
//   var members = server.members.array();
//   members.forEach(member => {
//     console.log(member.displayName);
//     if (member.displayName == "Microsoft Windows") {
//       member.setNickname("M");
//     }
//   })
// }



function minecraft(client, msg){
  if (msg.content.toLowerCase() != "!minecraft" && msg.content.toLowerCase() != "!mc" && msg.content.toLowerCase() != "!ip"){return false;}

  var url = "https://mcapi.us/server/status?ip="+process.env.MINECRAFT_IP
  request({
    url: url,
    json: true
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var online="Offline"
      if(body.online){online="Online";}

      msg.channel.send("", {embed: {
          color: 0x3e5c20,
          author: {
            name: "⁠",
            icon_url: "https://discordemoji.com/assets/emoji/grassblock.png"
          },

          description: "**IP: ** "+process.env.MINECRAFT_IP+"\n**Status: **" + online +"\n**Players: **" + body.players.now +"/"+body.players.max,
          footer: {
            text: "Minecraft server is courtesy of @" + rubberDuck.guilds.get(process.env.DEFAULT_SERVER).members.get(process.env.MINECRAFT_HOST_ID).user.username
          }
        }
      });
    }
  })
  return true;
}


function translate(client, msg){
  if (msg.content.toLowerCase().startsWith('!translate ')) {
   if(msg.author.bot){return false;}
   var text = msg.content.substring(msg.content.indexOf(' ') + 1).trim()
   if(text.length == 0){return false;}
   const translate = require('@vitalets/google-translate-api');

   translate(text, {to: 'en'}).then(res => {
     msg.channel.send(text + " translates from " + res.from.language.iso.toUpperCase() + " to: " + "`"+res.text+"`")
   }).catch(err => {
       console.error(err);
   });
   return true;
 }
}
