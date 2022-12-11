#Setting Up

- sessionToken

  Start a chatGPT chat session in a browser

  Open browser's application tab, you can find chatGPT session token in \_\_Secure-next-auth.session-token

- LINE SDK config

  Go to https://developers.line.biz/console/ and setup a bot with messaging API enabled, find CHANNEL_SECRET and CHANNEL_ACCESS_TOKEN

#Build

```
yarn install
```

#Start App

```
sessionToken=YOUR_SESSION_TOKEN
channelAccessToken=LINE_CHANNEL_ACCESS_TOKEN
channelSecret=LINE_CHANNEL_SECRET
PORT=PORT_NUMBER
yarn start
```

#ngrok

To host your webhook on your local machine, you can use ngrok
