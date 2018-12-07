const Discord = require('discord.js')
const bot = new Discord.Client()
const userTable = {}

bot.on('ready', () => {
  console.log("Hello! I'm Reco.")
  const channel = bot.channels.find(val => val.name === 'reco')

  bot.on('voiceStateUpdate', (oldMan, newMan) => {
    if (newMan.voiceChannel) {
      const userId = newMan.user.id
      if (!userTable[userId]) {
        userTable[userId] = { in: 0, out: 0 }
      }
      userTable[`${userId}`].in = new Date()
    }
    if (oldMan.voiceChannel && !newMan.voiceChannel) {
      const user = userTable[`${newMan.user.id}`]
      user.out = new Date()
      const workingTime = Math.floor((user.out - user.in) / 60000)
      const text = `${workingTime}分間お勤めお疲れ様です！`
      channel.send(`${text}`, { reply: newMan.user })
    }
  })
})

const token = process.env.TOKEN
bot.login(token)
