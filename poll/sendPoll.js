import Discord from 'discord.js';
import {IMAGE, COULEUR, NUMBER} from './../const.js';

function sendPoll(question, reponses, channel, db) {

    const embed = new Discord.MessageEmbed()
      .setColor(COULEUR)
      .setTitle(question)
      .setAuthor(process.env.NAME, IMAGE)
    .setTimestamp()
    .setFooter('Loïc - 2021');
  
    for (let index = 0; index < reponses.length; index++) {
      embed.addField(NUMBER[index]+' '+reponses[index],'\u200B');
    }
  
    channel.send(embed).then(
      sentMessage => {
  
        var dbMessage = db.collection('messages').doc(sentMessage.id);
  
        for (let index = 0; index < reponses.length; index++) {
          dbMessage.set({
            [NUMBER[index]] : ''
          }, {merge : true});
        }
  
        for (let index = 0; index < reponses.length; index++) {
          sentMessage.react(NUMBER[index]);
        }
  
      }
    );
}

export default sendPoll;