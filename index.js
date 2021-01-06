import Discord from 'discord.js';
import db from './firebase.js';
import addReaction from './reactions/addReaction.js';
import removeReaction from './reactions/removeReaction.js';
import {IMAGE, COULEUR, PREFIX} from './const.js';
import poll from './poll/poll.js';

const client = new Discord.Client({'partials': ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER']});

var IDBOT;

client.login(process.env.TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(PREFIX, { type: 'LISTENING' });
  IDBOT = client.user.id;
});

client.on('message', message => {

  if (message.content.startsWith(PREFIX)) {

    message.react("👋");

    if (message.channel.type == "dm") {

      const embed = new Discord.MessageEmbed()
	    .setColor(COULEUR)
      .setTitle("Hi! 👋 Commands :")
	    .setAuthor(process.env.NAME, IMAGE)
      .setTimestamp()
      .addField('\u200B', "👉 **"+PREFIX+" question**")
      .addField('or', '👉 **'+PREFIX+' "question" "answer1" "answer2"**')
      .setFooter('Loïc - 2021');

      //PollBot only
      if(process.env.NAME === "PollBot") {
        embed.addField('\u200B', "Visit ["+process.env.WEBSITE+"]("+process.env.WEBSITE+")")
        embed.addField('\u200B', "Add PollBot to your server ! [Click here]("+process.env.LIEN+")")
      }

      message.channel.send(embed);

    }else {
      if (message.content == PREFIX+" help" || message.content == PREFIX) {
        help(message.channel);
      } else {
        if(message.content == PREFIX+" servers") {
          servers(message.channel);
        }else {
          if(message.content == PREFIX+" rick") {
            message.channel.send('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
          }else {
            poll(message.content, message.channel, db);
          }
        }
      }
    }
  }
  
});

client.on('messageReactionAdd', async (reaction, user) => {
  addReaction(reaction, user, IDBOT, db);
});

client.on('messageReactionRemove', async (reaction, user) => {
  removeReaction(reaction, user, IDBOT, db)
});

function servers(channel) {
  channel.send('` '+client.guilds.cache.size+' servers `')
}

function help(channel) {
  
  const embed = new Discord.MessageEmbed()
	.setColor(COULEUR)
  .setTitle("Hi! 👋 Commands :")
	.setAuthor(process.env.NAME, IMAGE)
  .setTimestamp()
  .addField('\u200B', "👉 **"+PREFIX+" question**")
  .addField('or', '👉 **'+PREFIX+' "question" "answer1" "answer2"**')
  .setFooter('Loïc - 2021');

  //PollBot only
  if(process.env.NAME === "PollBot") {
    embed.addField('\u200B', "Visit ["+process.env.WEBSITE+"]("+process.env.WEBSITE+")")
    embed.addField('\u200B', "Add PollBot to your server ! [Click here]("+process.env.LIEN+")")
  }

  channel.send(embed);
}