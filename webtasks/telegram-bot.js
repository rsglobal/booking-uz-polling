const axios = require("axios");

function getStartMessage(webtaskUrl, chatId) {
  return `
1.  Open https://booking.uz.gov.ua in [modern browser](https://caniuse.com/#feat=es6-module)
2.  Type search parameters and submit form
3.  Copy next script and run in [browser dev console](https://developers.google.com/web/tools/chrome-devtools/console/):

\`\`\`
const script = document.createElement("script");

script.type = "module";
script.textContent = \`
  import {startPolling} from 'https://rawgit.com/bodia-uz/booking-uz-polling/master/index.js'
  
  startPolling({
    onResultChanged(results) {
      fetch('${webtaskUrl}?chatId=${chatId}&results=' + encodeURIComponent(results) + '&url=' + encodeURIComponent(window.location.href)));
    } 
  });
\`;

document.body.appendChild(script);
\`\`\`

Read more: https://github.com/bodia-uz/booking-uz-polling
  `;
}

function getResultsMessage(results, url) {
  return `[${results}](${url})`;
}

function sendMessage(token, chatId, message) {
  return axios.get(`https://api.telegram.org/bot${token}/sendMessage`, {
    params: {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
      disable_web_page_preview: true
    }
  });
}

function onUpdate(update, secrets) {
  const chatId = update.message.chat.id;
  const message = update.message.text;

  if (message.match(/\/(start|help)/)) {
    sendMessage(
      secrets.BOT_TOKEN,
      chatId,
      getStartMessage(secrets.WEBTASK_URL, chatId)
    );
    return;
  }
}

/**
 * @param context {WebtaskContext}
 */
module.exports = function(context, cb) {
  const secrets = context.secrets;
  const query = context.query;
  const data = context.body;

  if (query.token === secrets.BOT_TOKEN) {
    onUpdate(data, secrets);
    return cb(null, { hello: "telegram" });
  }

  if (query.chatId && query.results) {
    sendMessage(
      secrets.BOT_TOKEN,
      query.chatId,
      getResultsMessage(query.results, query.url)
    );
    return cb(null, { hello: "booking-uz-polling" });
  }

  return cb(null, { hello: "anonymous" });
};
