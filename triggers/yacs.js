var triggerUtils = require('../trigger_utils.js');
var path = require('path');
var name = path.basename(__filename);

exports.shouldRun = function(eventType, client, msg, config) {
  if (eventType != "message") {
    return false;
  }
  if (msg.author.bot) {
    return false;
  }
  if (msg.channel.type != "dm" && msg.member.guild.id != config.default_server.id) {
    return false;
  }
  if (client.user.id != config.user_ids.rd_id) {
    return false;
  }

  if (!msg.content.startsWith("!yacs")) {
    return false;
  }
  if (!triggerUtils.textAfterGap(msg.content)) {
    return false;
  }

  return true;
}

const Discord = require('discord.js');
var request = require("request")
exports.run = function(eventType, client, msg, config, database, extra) {
  console.log("Just ran: " + name);
  var className = triggerUtils.textAfterGap(msg.content);

  var url = "https://rpi.yacs.io/api/v6/listings?filter[longname][match]=" + className
  request({
    url: url,
    json: true
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      // console.log(body.data[0])
      if(body.data.length == 0){
        msg.channel.send("Could not find any info on: `" + className + "`")
        return;
      }

      var description = body.data[0].attributes.description;
      description = description.replace("Prerequisites/Corequisites:", "**Prerequisites/Corequisites:**")
      if(!description.includes("**")){
        description = description.replace("Prerequisites", "**Prerequisites**")
      }

      let exampleEmbed = new Discord.RichEmbed()
        .setColor('#cd545b')
        .setTitle(body.data[0].attributes.longname + " " + body.data[0].attributes.subject_shortname + "-" + body.data[0].attributes.course_shortname)
        // .setURL('https://discord.js.org/')
        // .setAuthor(body.data[0].attributes.longname)//, 'https://cdn.discordapp.com/emojis/591843192589254666.png', 'https://discord.js.org'
        .setDescription(description)
        .setThumbnail('https://cdn.discordapp.com/emojis/591843192589254666.png')
        // .addField('Regular field title', 'Some value here')
        // .addBlankField()
        // .addField('Inline field title', 'Some value here', true)
        // .addField('Inline field title', 'Some value here', true)
        // .addField('Inline field title', 'Some value here', true)
        // .setImage('https://i.imgur.com/wSTFkRM.png')
        .setTimestamp()
        .setFooter('Data courtesy of the yacs api https://yacs.io');

      request({
        url: "https://"+body.data[0].relationships.sections.links.related,
        json: true
      }, function(error2, response2, body2) {
        if (!error2 && response2.statusCode === 200) {
          // console.log(body2.data[0]);
          for(var i=0;i<Object.keys(body2.data).length;i++){
            var section = body2.data[i];
            console.log(section)
            var instructors = ""
            for(instructor in section.attributes.instructors){
              instructors += " " +section.attributes.instructors[instructor] + ","
            }
            instructors = instructors.substring(0, instructors.length - 1);

            instructors = ""
            exampleEmbed.addField("Section " + i + ":" + instructors, section.attributes.seats - section.attributes.seats_taken +"/"+ section.attributes.seats, true)
          }

          msg.channel.send(exampleEmbed);
        }
      })
    }
  })
}
