import { NUMBER } from './../const.js';
import editEmbed from './editEmbed.js';
import firebase from 'firebase';

async function addReaction(reaction, user, IDBOT, db) {

  if (reaction.message.partial) {
    try {
      await reaction.message.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the message: ', error);
    }
  }

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Something went wrong when fetching the Reaction: ', error);
    }
  }

  var message = reaction.message;

  if (message.author.id == IDBOT) {
    if (user.id != IDBOT) {
      let reactionInvalid = true;
      for (let index = 0; index < message.embeds[0].fields.length; index++) {
        if (message.embeds[0].fields[index].name.startsWith(reaction.emoji.name)) {
          reactionInvalid = false;
        }
      }

      if (!reactionInvalid) {
        let patch = {};

        var dbMessage = db.collection('messages').doc(message.id);

        dbMessage.get().then(doc => {
          if (doc.exists) {
            var rows = doc.data();
            if(!rows[reaction.emoji.name][user.id]) {
              for (let index = 0; index < message.embeds[0].fields.length; index++) {
                patch[NUMBER[index]] = {
                  [user.id]: reaction.emoji.name === NUMBER[index] ? firebase.firestore.Timestamp.fromDate(new Date()) : false
                }
              }
            }else {
              for (let index = 0; index < message.embeds[0].fields.length; index++) {
                patch[NUMBER[index]] = {
                  [user.id]: false
                }
              }
            }
            dbMessage.set(patch, { merge: true })
                .then(() => {
                  editEmbed(message, db.collection('messages').doc(message.id));
                });
          }
        })

      }

      reaction.users.remove(user.id);

    }
  }
}

export default addReaction;