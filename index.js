import Discord from 'discord.js';
import db from './firebase.js';
import addReaction from './reactions/addReaction.js';
import { IMAGE, COULEUR, PREFIX } from './const.js';
import poll from './poll/poll.js';

const client = new Discord.Client({ 'partials': ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'] });

var IDBOT;

client.login(process.env.TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(PREFIX, { type: 'LISTENING' });
  IDBOT = client.user.id;
});

client.on('message', message => {

  if (message.content.startsWith(PREFIX) && !(message.author.bot)) {

    message.react("👋");

    if (message.channel.type == "dm") {

      const embed = new Discord.MessageEmbed()
        .setColor(COULEUR)
        .setTitle("Hi! 👋 Commands :")
        .setAuthor(process.env.NAME, IMAGE)
        .setTimestamp()
        .addField('\u200B', "👉 **" + PREFIX + " question**")
        .addField('or', '👉 **' + PREFIX + ' "question" "answer1" "answer2"**')
        .setFooter('Loïc - 2021');

      message.channel.send(embed);

    } else {
      if (message.content == PREFIX + " help" || message.content == PREFIX) {
        help(message.channel);
      } else {
        if (message.content == PREFIX + " servers") {
          servers(message.channel);
        } else {
          if (message.content == PREFIX + " rick") {
            message.channel.send('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
          } else {
            poll(message.content, message.channel, db, message.id);
          }
        }
      }
    }
  }

});

client.on('messageReactionAdd', async (reaction, user) => {
  addReaction(reaction, user, IDBOT, db);
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (newMessage.partial) {
    try {
      await newMessage.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message: ', error);
    }
  }
  if(newMessage.content.startsWith(PREFIX)) {
    if (newMessage.author) {
      if (!newMessage.author.bot) {
        db.collection('messages').where('idMessage', '==', newMessage.id).get().then((snapshot) => {
          if (!snapshot.empty) {
            if (snapshot.size === 1) {
              poll(newMessage.content, newMessage.channel, db, newMessage.id, true);
            }
          }
        })
      }
    }
  }
  
});

function servers(channel) {
  channel.send('` ' + client.guilds.cache.size + ' servers `')
}

function help(channel) {
  const embed = new Discord.MessageEmbed()
    .setColor(COULEUR)
    .setTitle("Hi! 👋 Commands :")
    .setAuthor(process.env.NAME, IMAGE)
    .setTimestamp()
    .addField('\u200B', "👉 **" + PREFIX + " question**")
    .addField('or', '👉 **' + PREFIX + ' "question" "answer1" "answer2"**')
    .setFooter('Loïc - 2021');

  channel.send(embed);
}