const Discord = require('discord.js')
const bot = new Discord.Client()
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
  }
  if (oldMan.voiceChannel) {
    console.log(
      `${oldMan.displayName}が${oldMan.voiceChannel.name}を退室しました`,
      oldMan.user.id
    )
  }
})
const token = process.env.TOKEN
bot.login(token)
