import Discord from 'discord.js';
import {IMAGE, COULEUR, NUMBER} from './../const.js';

function editEmbed(message, dbMessage) {
    //Build embed
  
    const embed = new Discord.MessageEmbed()
    .setColor(COULEUR)
    .setTitle(message.embeds[0].title)
    .setAuthor(process.env.NAME, IMAGE)
    .setTimestamp()
    .setFooter('Loïc - 2020');
    
    dbMessage.get().then((doc) => {
      if(doc.exists) {
        var rows = doc.data();
  
        for (let index = 0; index < message.embeds[0].fields.length; index++) {
          var field = '';
          var raw = rows[NUMBER[index]];
  
          var row = new Array();
          
          Object.keys(raw).forEach(key => {
            var temp = [{
              id: key,
              date: raw[key]
            }];
            Array.prototype.push.apply(row, temp)
          })
  
          row.sort(function(a,b){
            return a['date']['seconds'] - b['date']['seconds'];
          });
  
          row.forEach(el => {
            if(el['date'] != false) {
              field = field + " <@"+el['id']+">";
            }
          });
  
          if(field == '') {
            field = '\u200B';
          }
  
          embed.addField(message.embeds[0].fields[index].name, field);
  
        }
      }
  
      message.edit(embed);
            
    })
  }

export default editEmbed;