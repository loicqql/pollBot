import editEmbed from './editEmbed.js';

async function remodeReaction(reaction, user, IDBOT, db) {
    if(reaction.partial) {

        try {
          await reaction.fetch();
        }catch (error) {
          console.error('Something went wrong when fetching the message: ', error);
        }
        
      }
    
      var message = reaction.message;
    
      if(message.author.id == IDBOT) {
        if(user.id != IDBOT) {
    
          let reactionInvalid = true;
    
          for (let index = 0; index < message.embeds[0].fields.length; index++) {
            if(message.embeds[0].fields[index].name.startsWith(reaction.emoji.name)) {
              reactionInvalid = false;
            }
          }
    
          if(!reactionInvalid) {
    
            var dbMessage = db.collection('messages').doc(message.id);
          
            dbMessage.set({
              [reaction.emoji.name] : {
                [user.id] : false
              }
            }, {merge : true})
            .then(() => {
              editEmbed(message, db.collection('messages').doc(message.id));
            })
        
          }
          
        }
    }
}

export default remodeReaction;