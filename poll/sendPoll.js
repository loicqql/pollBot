import Discord from 'discord.js';
import { IMAGE, COULEUR, NUMBER } from './../const.js';
import editEmbed from '../reactions/editEmbed.js';

function sendPoll(question, reponses, channel, db, idMessage, isUpdatedMessage) {

  const embed = new Discord.MessageEmbed()
    .setColor(COULEUR)
    .setTitle(question)
    .setAuthor(process.env.NAME, IMAGE)
    .setTimestamp()
    .setFooter('Loïc - 2021');

  for (let index = 0; index < reponses.length; index++) {
    embed.addField(NUMBER[index] + ' ' + reponses[index], '\u200B');
  }

  if (isUpdatedMessage) {
    db.collection('messages').where('idMessage', '==', idMessage).get().then((snapshot) => {
      if (!snapshot.empty) {
        snapshot.forEach(doc => {
          if (doc.id) {
            channel.messages.fetch(doc.id)
              .then(message => {
                if (message) {
                  message.reactions.removeAll();
                  for (let index = 0; index < reponses.length; index++) {
                    message.react(NUMBER[index]);
                  }
                  message.edit(embed).then(sentMessage => {
                    editEmbed(sentMessage, db.collection('messages').doc(sentMessage.id));

                    //Supprime data des autres fields  
                    let patch = {};
                    for (let index = message.embeds[0].fields.length; index < NUMBER.length; index++) {
                      patch[NUMBER[index]] = false
                    }
                    var dbMessage = db.collection('messages').doc(sentMessage.id);
                    dbMessage.set(patch, { merge: true });
                  });
                }
              })
              .catch(console.error);
          }
        })
      }
    })
  } else {
    channel.send(embed).then(
      sentMessage => {

        var dbMessage = db.collection('messages').doc(sentMessage.id);

        dbMessage.set({
          'idMessage': idMessage
        }, { merge: true });

        for (let index = 0; index < reponses.length; index++) {
          dbMessage.set({
            [NUMBER[index]]: ''
          }, { merge: true });
        }

        for (let index = 0; index < reponses.length; index++) {
          sentMessage.react(NUMBER[index]);
        }
      }
    );
  }
}

export default sendPoll;