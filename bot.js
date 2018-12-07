const Discord = require('discord.js')
const bot = new Discord.Client()

const channelId = process.env.CHANNEL_ID
const userTable = {}
const numOfMember = 5
for (let i = 0; i < numOfMember; i++) {
  userTable[process.env[`USER_ID_${i}`]] = { in: 0, out: 0 }
}

console.log(userTable)
bot.on('ready', () => {
  console.log("Hello! I'm Reco.")
})

bot.on('message', message => {
  if (message.content === 'bit') {
    message.reply('bot')
  } else if (message.content === 'bot') {
    message.reply('bit')
  }
})

bot.on('voiceStateUpdate', (oldMan, newMan) => {
  if (newMan.voiceChannel) {
    console.log(
      `${newMan.displayName}が${newMan.voiceChannel.name}に入室しました`,
      newMan.user.id
    )
    userTable[`${newMan.user.id}`].in = new Date()
  }
  if (oldMan.voiceChannel) {
    console.log(
      `${oldMan.displayName}が${oldMan.voiceChannel.name}を退室しました`,
      oldMan.user.id
    )
    if (!newMan.voiceChannel) {
      const user = userTable[`${newMan.user.id}`]
      user.out = new Date()
      const workingTime = Math.floor((user.out - user.in) / 60000)
      const text = `${oldMan.displayName}さんは${workingTime}分働きました`
      bot.channels
        .find(val => val.id === channelId)
        .send(`${text}`, { reply: newMan.user })
    }
  }
})
const token = process.env.TOKEN
bot.login(token)
