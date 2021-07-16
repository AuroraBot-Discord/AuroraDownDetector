const discord = require("discord.js");
const client = new discord.Client();
const currentStatus = {}
const prefix = "add!";

const express = require("express");
const app = express();
app.get("/", function (req, res, next) {
  res.send("Discord Bot is Online!");//Express使った意味は特にないです(httpでもおｋ)
});
app.listen(8080);

client.on('ready', async () => {
  console.log("Logged in!");
  const AuroraBot = await client.users.fetch("820549182984814645");
  const AuroraBot_Dev = await client.users.fetch("841539874577317888");
  const LogChannel = await client.channels.fetch("865068007599767557");
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
  if (oldPresence && oldPresence.userID !== "820549182984814645" && oldPresence.userID !== "841539874577317888") return;
  if (newPresence && newPresence.userID !== "820549182984814645" && newPresence.userID !== "841539874577317888") return;
  if (oldPresence.status == newPresence.status) return;
  if (newPresence.userID === "820549182984814645") {
    if (status && status.stable === newPresence.status) return;
  } else {
    if (status && status.dev === newPresence.status) return;
  }
  const LogChannel = client.channels.cache.get("865068007599767557");
  if (newPresence.status === "offline") {
    if (newPresence.user.id === "841539874577317888") {
      status.dev = "offline";
    } else {
      status.stable = "offline";
    }
    LogChannel.send("<@!744752301033521233>!起きて！", {embed: {
      title: "ダウン情報",
      description: `<@!${newPresence.user.id}>がダウンしています。`,
      color: 0xff0000
    }});
  } else if (newPresence.status !== "offline") {
    if (newPresence.user.id === "841539874577317888") {
      status.dev = "online";
    } else {
      status.stable = "online";
    }
    LogChannel.send({embed: {
      title: "アップ情報",
      description: `<@!${newPresence.user.id}>がオンラインに復帰しました。`,
      color: 0x00ff00
    }});
  }
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix)) return;
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "downcheck") {
    function isOnline(userId) {
      if (client.users.cache.get(userId).presence.status !== "offline") {
        return "<:online:851040859297677322>オンライン";
      } else {
        return "<:offline:851040962969206796>オフライン";
      }
    }
    message.channel.send({embed: {
      title: "ステータス情報",
      fields: [
        {
          name: "AuroraBot",
          value: isOnline("820549182984814645")
        },
        {
          name: "AuroraBot Dev",
          value: isOnline("841539874577317888")
        }
      ]
    }})
  }
});

client.login(process.env.token);
