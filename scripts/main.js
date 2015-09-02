// Description:
//   The master of conundrums itself, the riddlebot will stump you with only the most difficult riddles, and if you ask nicely it might listen to your's.
//
// Commands:
//   riddle me this? - Gives the user a riddle.
//   riddle me that? - Gives the answer to the last riddle given.
//   riddle me done! [user's answer] - Determines whether the user's answer is correct or not.
//   riddlebot get smart [riddle] [answer] - saves riddle to file and responds with "Clever, clever. I'll remember that."
//
// Author:
//   HerrPfister

var fs = require('fs');
var path = require('path');
var riddles = require('../static/consts/riddles.json');

module.exports = function (robot) {
  robot.hear(/riddle me this[?]/i, function (res) {
    var index = Math.floor(Math.random() * riddles.count);
    var riddle = riddles[index].riddle;
    var answer = riddles[index].answer;

    robot.brain.set('answer', answer);
    res.reply('It\'s time to get smart! ' + riddle);
  });

  robot.hear(/riddle me that[?]/i, function (res) {
    var correctAnswer = robot.brain.get('answer');

    res.reply('Giving up already? Well I should have seen that coming. Here is the answer to that riddle: ' + correctAnswer);
  });

  robot.hear(/riddle me done[!]\s*(.*)/i, function (res) {
    var userAnswer = res.match[1].toLowerCase();
    var correctAnswer = robot.brain.get('answer').toLowerCase();

    if (!userAnswer || correctAnswer.indexOf(userAnswer) === -1) {
      res.reply('Wrong! It doesn\'t suprise me that I out smarted you.');
    } else {
      robot.brain.set('answer', '');
      res.reply('Well would you look at that! You do have the ability to think. ' +
        'Alas! Don\'t get too comfortable, because the next one will be much harder.');
    }
  });

  robot.respond(/get smart\s*(.*[?])\s*(.*)/i, function (res) {
    var riddle = res.match[1];
    var answer = res.match[2];

    riddles[riddles.count] = {
      riddle: riddle,
      answer: answer
    };

    riddles.count += 1;

    var newRiddles = JSON.stringify(riddles);

    fs.writeFile(path.join(__dirname + '/../static/consts/riddles.json'), newRiddles, function (err) {
      if (err) {
        console.log(JSON.stringify(err))
        res.send('Ouch! My head hurts, and I can\'t remember a thing you said. Can we try that again?');
      } else {
        res.send('Clever, clever. I\'ll remember that.');
      }
    });
  });
};
