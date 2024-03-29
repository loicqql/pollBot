import sendPoll from "./sendPoll.js";
import erreur from "./erreur.js";
import { PREFIX } from "../const.js";

function poll(message, channel, db, idMessage, isUpdatedMessage = false) {

  if (message.includes('"')) {
    var words;
    words = message.split('"');

    var question = words[1];

    if (words.length > 3) { //Avec réponses

      var verifQ = true;
      if (question == "" | question == " ") {
        erreur('`❌ invalid question ❌`', channel);
        verifQ = false;
      }

      var reponses = new Array();
      var y = 0;
      for (let i = 3; i < words.length; i = i + 2) {
        reponses[y] = words[i];
        y++;
      }

      var verifR = true;
      for (let i = 0; i < reponses.length; i++) {
        var test = reponses[i];
        if (test == "" | test == " ") {
          verifR = false;
        }
      }

      if (verifR == false) {
        erreur('`❌ invalid answers ❌`', channel);
      }

      if (reponses.length > 10) {
        erreur('`❌ 10 answers maximum ❌`', channel);
      } else {
        if (verifR && verifQ) {
          sendPoll(question, reponses, channel, db, idMessage, isUpdatedMessage);
        }
      }

    } else {
      if (question == "" | question == " ") {
        erreur('`❌ invalid question ❌`', channel);
      } else {
        sendPoll(question, ['Yes', 'No'], channel, db, idMessage, isUpdatedMessage);
      }
    }
  } else {
    sendPoll(message.substring(PREFIX.length), ['Yes', 'No'], channel, db, idMessage, isUpdatedMessage);
  }
}

export default poll;