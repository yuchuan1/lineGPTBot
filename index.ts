import { ChatGPTAPI } from "chatgpt";
import line, { Message } from "@line/bot-sdk";
import express from "express";

// chatGPT sessionToken is required; see below for details
const api = new ChatGPTAPI({
  sessionToken: process.env.CHATGPT_SESSION_TOKEN,
} as any);

// create LINE SDK config from env variables
const config: any = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post("/callback", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  // ensure chatGPT API is properly authenticated
  api
    .ensureAuth()
    .then(() => {
      // get chatGPT conversation
      const conversation = api.getConversation();
      if (event.type !== "message" || event.message.type !== "text") {
        // ignore non-text-message event
        return Promise.resolve(null);
      }

      if (event.message.text.includes("EdBot")) {
        const inputForChatGPT = event.message.text.replace("EdBot", "");
        conversation.sendMessage(inputForChatGPT).then((response) => {
          const reply: Message = { type: "text", text: response };
          // use line reply API
          return client.replyMessage(event.replyToken, reply);
        });
      }
    })
    .catch((err) => {
      console.error("gpt error", err);
      const erreMsg: Message = {
        type: "text",
        text: `chatGPT Error: ${err}`,
      };
      return client.replyMessage(event.replyToken, erreMsg);
    });
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
