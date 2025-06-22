// index.js
console.log("✅ AhadBot is now running via GitHub Actions...");

setInterval(() => {
  console.log("⏱ Bot still alive: " + new Date().toLocaleTimeString());
}, 60000);
