# Polling with notifications for [booking.uz.gov.ua](https://booking.uz.gov.ua)

1.  Open https://booking.uz.gov.ua in [modern browser](https://caniuse.com/#feat=es6-module)
2.  Type search parameters and submit form
3.  Copy next script and run in [browser dev console](https://developers.google.com/web/tools/chrome-devtools/console/):

```js
const script = document.createElement("script");

script.type = "module";
script.textContent = `
  import {startPolling} from 'https://rawgit.com/bodia-uz/booking-uz-polling/master/index.js'
  
  startPolling();
`;

document.body.appendChild(script);
```

## API

```js
const stopPolling = startPolling({
  pollingIntervalMs: 3 * 60 * 1000,
  resultToString: result => JSON.stringify(result),
  onResult: (resultStr, result) => console.log(result),
  onResultChanged: (resultStr, result) => console.log(result)
});

// run `stopPolling()` to stop polling;
```

## Telegram notifications

Add chat with [@TrainKetsBot](https://t.me/TrainKetsBot) and follow instructions.

Or create your own bot:

1.  Register in [telegram](https://web.telegram.org/#/login)
2.  Create new bot using [@BotFather](https://t.me/BotFather) command `/newbot` and get `<token>`
3.  Write random text to your bot and extract `<chat_id>` from `https://api.telegram.org/bot<token>/getUpdates` response:
    `<chat_id>` = `response->message->chat->id`
4.  Use `onResultChanged` function to notify via telegram:

```js
const script = document.createElement("script");

script.type = "module";
script.textContent = `
  import {startPolling} from 'https://rawgit.com/bodia-uz/booking-uz-polling/master/index.js'
  
  startPolling({
    onResultChanged(results) {
      fetch('https://api.telegram.org/bot<token>/sendMessage?chat_id=<chat_id>&text=' + encodeURIComponent(results))
    }
  });
`;

document.body.appendChild(script);
```
