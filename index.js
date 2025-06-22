const express = require("express");
const app = express();

const VERIFY_TOKEN = "ahad"; // তুমি Facebook Developer Console-এ এই Token দিয়েছো

app.use(express.json());

// Webhook verify route
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
    res.send("AhadBot is alive!"); // fallback message
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("AhadBot is running...");
});
