// THIS IS ONLY FOR CODE WHICH IS NOT ACTIVE BUT ***MAY*** EVENTUALLY BE HELPFUL
// NOTHING IN THIS FILE ACTIVELY AFFECTS HOW THE DUCKS MESSAGE

/*
//this code allowes us to speak as the ducks
var eli_currentChatID = "";
var ben_currentChatID = "";

function sendMessagAsBot(msg, botClient){
  if(msg.channel.type == "dm" && (msg.author.id == process.env.ELI_ID || msg.author.id == process.env.BEN_ID)){ 
    //add message to the msgToSend var
    var msgToSend = msg.content;
    
    //change current chat id
    var getChannel  = /^\d{18}/;
    if(msgToSend.match(getChannel)){
      if(msg.author.id == process.env.ELI_ID){
        eli_currentChatID = msgToSend.match(getChannel)[0].trim()
        msg.channel.send("Changed default chat to: " + botClient.channels.get(eli_currentChatID).name + " (" + eli_currentChatID + ")")
      }else if(msg.author.id == process.env.BEN_ID){
        ben_currentChatID = msgToSend.match(getChannel)[0].trim()
        msg.channel.send("Changed default chat to: " + botClient.channels.get(ben_currentChatID).name + " (" + ben_currentChatID + ")")
      }
      return true;
    }
    
    //set current id
    var id = "";
    if(msg.author.id == process.env.ELI_ID){
      id = eli_currentChatID;
    }else if(msg.author.id == process.env.BEN_ID){
      id = ben_currentChatID;
    }
    
    //checks for empty id
    if(id == ""){
      msg.channel.send("Please set a channel ID. No id found.");
      return true;
    }
    
    //tts
    var tts = false;
    // if(msgToSend.startsWith("tts ")){
    //   msgToSend = msgToSend.substring(4);//remove tts from msg
    //   tts = true;
    // }
    
    //check for user tags and make them work
    var getUser  = /\@\d{18}\b/;
    msgToSend = msgToSend.replace(getUser, function(theString){
      return "<" + theString + ">"
    })
    
    var getUserNoId  = /@(.*?)~/g
    msgToSend = msgToSend.replace(getUserNoId, function(theName){
      var users = botClient.guilds.get(process.env.DEFAULT_SERVER).members.array()
      var theName2 = theName.substring(0, theName.length - 1);
      for(var i=0;i<users.length;i++){
        if("@" + users[i].nickname == theName2 || "@" + users[i].user.username == theName2){
          console.log("<@" + users[i].id + ">")
          return "<@" + users[i].id + ">"
        }
      }
      
      return theName2
    })
    
    
    console.log(msgToSend)
    if(tts){
      var channel = botClient.channels.get(id);
      console.log(msgToSend)
      botClient.channels.get(id).send(msgToSend, {
       tts: true
      })
    }else{
      // botClient.channels.get(id).send(msgToSend, {
      //  tts: false
      // })
      delaySend(botClient, null, msgToSend, 1000, id);
    }
    return true;
  }
  return false;
}


//set time task
schedule.scheduleJob('0 0 4 * * 5', function(){
  rubberDuck.channels.get("486600474733314058").send("@here One hour remaining! Make sure to submit at least something just in case you lose track of time.")
});

schedule.scheduleJob('0 55 4 * * 5', function(){
  var date = new Date();
  console.log("5 minutes remaining");
  rubberDuck.channels.get("486600474733314058").send("@here 5 minutes remaining")
});


midnigthCountdown(5, "@here FINISHED! I hope everyone got their homework in on time!", "486600474733314058", rubberDuck);
midnigthCountdown(5, "@here Forget about data structures, it's time to SMASH!", "486600474733314058", rubberDuck);

//Test countdown
var endDate = new Date("Dec 18, 2018 13:00:00").getTime();
setTimeout(testCountdown, 3 * 1000 * 60);
function testCountdown() {
  var minTime = 10;
  var maxtime = 30;
  var rand = Math.floor(Math.random()*(maxtime-minTime+1)+minTime);

  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now an the count down date
  var distance = endDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (distance > 0) {
    var msgText = days + " days " + hours + " hours " + minutes + " minutes until the final!";
    delaySend(rubberDuck, null, msgText, 5000, "510267786422124564");
    // console.log(msgText);
    setTimeout(testCountdown, rand * 1000 * 60); 
  }
}


*/