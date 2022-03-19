var botui = new BotUI('faqs-bot');
var loadingMsgIndex;
var API = 'https://gitam-2021.github.io/apis/faqs-bot/db.json';


function init() {
  botui.message
    .bot({
      delay: 500,
      content: 'Welcome to GITAM FAQs Bot. <br> What do you want to look into?'
    })
    .then(function () {
      return botui.action.button({
        delay: 1000,
        action:[{
          text: 'Unix Commands',
          value: 'unixCommands'
        }, {
          text: 'Cheat Sheets',
          value: 'cheatSheets'
        }, {
          text: 'Ask question',
          value: 'ask'
        }]
      })
    }).then(function (res) {
      if(res.value == 'unixCommands') {
        unixCommandsShow();
      } else if (res.value == 'cheatSheets') {
        cheatSheetsShow();
      } else {
        askQuestions();
      }
    });
}

var unixCommandsShow = function () {}

var cheatSheetsShow = function () {}

var askQuestions = function () {
  return botui.action.text({
    dela  : 1000,
    action: {
      size: 120,
      value: '', // default placeholder
      sub_type: 'string',
      placeholder: 'What is ...'
    }
  }).then(function (res) {
    loadingMsgIndex = botui.message.bot({
      delay: 200,
      loading: true
    }).then(function (index) {
      loadingMsgIndex = index;
      sendXHR(res.value, showMatches)
    });
  });
}

function sendXHR(keyword, cb) {
  var xhr = new XMLHttpRequest();
  var self = this;
  xhr.open('GET', API);
  xhr.onload = function () {
    var res = JSON.parse(xhr.responseText)
    cb(res[keyword]);
  }
  xhr.send();
}

// TODO: add the json as just url part of HTML or JS to load along with this file.
function showMatches(details) {
  if (details == undefined) {
    botui.message
    .update(loadingMsgIndex, {
      content: "I am not able to understand. Can you rephrase your question?"
    })
    .then(askQuestions);

  } else {
    botui.message
    .update(loadingMsgIndex, {
      content: details.short_content
    });

    botui.message
    .bot({
      delay: 500,
      content: details.more_content
    })
    .then(askQuestions);
  }
}

init();
