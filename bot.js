;(async () => {
  const Discord = require('discord.js')

  const bot = new Discord.Client()
  bot.login(process.env.TOKEN)
  const userTable = {}
  const rooms = {}

  bot.on('ready', () => {
    // recochan準備完了
    console.log("Hello! I'm Reco.")
    const logBot = new Discord.Client()
    logBot.login(process.env.TOKEN_LOG)

    logBot.on('ready', () => {
      // log記録用bot準備完了
      rooms['reco'] = bot.channels.find(val => val.name === 'reco')
        ? bot.channels.find(val => val.name === 'reco')
        : await (async () => {
            return await bot.guilds
              .find(val => {
                return true
              })
              .createChannel('reco', 'text')
          })()

      bot.on('voiceStateUpdate', (oldMan, newMan) => {
        const now = new Date()
        if (oldMan.voiceChannel) {
          rooms.log.send(
            `${oldMan.displayName}が${
              oldMan.voiceChannel
            }から${now}から退出しました`
          )
          const userId = newMan.user.id
          if (!userTable[userId]) {
            userTable[userId] = { in: 0, out: 0 }
          }
          const user = userTable[userId]
          user.out = now
          if (!newMan.voiceChannel) {
            const workingTime = Math.floor((user.out - user.in) / 60000)
            if (workingTime > 4) {
              const text = `${workingTime}分間お勤めお疲れ様です！`
              rooms.reco.send(`${text}`, { reply: newMan.user })
            }
          }
        }
        if (newMan.voiceChannel) {
          rooms.log.send(
            `${newMan.displayName}が${
              newMan.voiceChannel
            }から${now}に入室しました`
          )
          const userId = newMan.user.id
          if (!userTable[userId]) {
            userTable[userId] = { in: 0, out: 0 }
          }

          userTable[`${userId}`].in = now
        }
      })

      rooms['log'] = logBot.channels.find(val => val.name === 'logs')
        ? logBot.channels.find(val => val.name === 'logs')
        : await (async () => {
            return await logBot.guilds
              .find(val => {
                return true
              })
              .createChannel('logs', 'text')
          })()
    })
  })
})()
