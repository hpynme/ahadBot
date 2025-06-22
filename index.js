const express = require("express");
const request = require("request");
const app = express();

const VERIFY_TOKEN = "ahad";
const PAGE_ACCESS_TOKEN = process.env.PAGE_TOKEN; // Render Environment Variable

app.use(express.json());

// Facebook Webhook Verification
app.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  } else {
    res.send("AhadBot is alive!");
  }
});

// Message Receive & Reply
app.post("/", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach(entry => {
      const webhook_event = entry.messaging[0];
      const sender_psid = webhook_event.sender.id;

      if (webhook_event.message && webhook_event.message.text) {
        const userMessage = webhook_event.message.text;
        sendTextMessage(sender_psid, `👋 তুমি লিখেছো: "${userMessage}"`);
      }
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// Reply Function
function sendTextMessage(sender_psid, message) {
  const request_body = {
    recipient: {
      id: sender_psid
    },
    message: {
      text: message
    }
  };

  request({
    uri: "https://graph.facebook.com/v17.0/me/messages",
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: "POST",
    json: request_body
  }, (err, res, body) => {
    if (!err) {
      console.log("✅ Message sent!");
    } else {
      console.error("❌ Unable to send message: " + err);
    }
  });
}

app.listen(process.env.PORT || 3000, () => {
  console.log("📡 AhadBot is running...");
});
