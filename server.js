require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const app = express();

// Middleware for LINE Signature verification
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
});

const client = new line.Client(config);

// Echo back any text message
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text message
    return Promise.resolve(null);
  }

  const userId = event.source.userId;
  console.log('User ID:', userId);

  const echo = {
    type: 'text',
    text: `Your message: ${event.message.text}\nYour User ID: ${userId}`
  };

  return client.replyMessage(event.replyToken, echo);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LINE bot listening on port ${PORT}`);
});
