const Discord = require('discord.js')

const bot = new Discord.Client()
bot.login(process.env.TOKEN)
const userTable = {}
const rooms = {}
// const e = -1
const e = 299999

bot.on('ready', async () => {
  // recochan準備完了
  console.log("Hello! I'm Reco.")

  rooms['reco'] = bot.channels.find(val => val.name === 'reco')
    ? bot.channels.find(val => val.name === 'reco')
    : await bot.guilds
        .find(val => {
          return true
        })
        .createChannel('reco', 'text')
  rooms['logs'] = bot.channels.find(val => val.name === 'logs')
    ? bot.channels.find(val => val.name === 'logs')
    : await bot.guilds
        .find(val => {
          return true
        })
        .createChannel('logs', 'text')

  bot.on('voiceStateUpdate', (oldMem, newMem) => {
    const localTime = new Date()
    const now = new Date(
      localTime + (localTime.getTimezoneOffset() + 9 * 60) * 60000
    )
    if (oldMem.voiceChannel) {
      const userId = newMem.user.id
      rooms.logs.send(`${formatRoomOut(now, oldMem)}`)
      if (!userTable[userId]) {
        userTable[userId] = { in: 0, out: 0 }
      }
      const user = userTable[userId]
      if (!newMem.voiceChannel && user.in !== 0) {
        user.out = now
        const workingTime = user.out - user.in
        if (workingTime > e) {
          const text = formatWorkTime(workingTime, user)
          rooms.reco.send(`${text}`, { reply: newMem.user })
        }
      }
    }
    if (newMem.voiceChannel) {
      const userId = newMem.user.id
      rooms.logs.send(`${formatRoomIn(now, newMem)}`)
      if (!userTable[userId]) {
        userTable[userId] = { in: 0, out: 0 }
      }
      userTable[`${userId}`].in = now
    }
  })
})

function formatWorkTime(workingTime, user) {
  return `${ms2m(workingTime)}分間お勤めお疲れ様です！(${dateFormat(
    user.in
  )} 〜 ${dateFormat(user.out)})`
}

function formatRoomIn(now, newMem) {
  return `${dateFormat(now)} **${newMem.displayName}** が${
    newMem.voiceChannel
  }に入室しました`
}

function formatRoomOut(now, oldMem) {
  return `${dateFormat(now)} **${oldMem.displayName}** が${
    oldMem.voiceChannel
  }から退出しました`
}

function dateFormat(d) {
  if (d) {
    const year = d.getFullYear()
    const month = zeroPadding(d.getMonth() + 1)
    const date = zeroPadding(d.getDate())
    const day = '日月火水木金土'.charAt(d.getDay())
    const hour = zeroPadding(d.getHours())
    const minute = zeroPadding(d.getMinutes())
    const str = `${year}/${month}/${date}/ (${day}) ${hour}:${minute}`
    return str
  } else {
    console.log('Your date is not found.')
  }
}

function ms2m(time) {
  return Math.floor(time / 60000)
}

function zeroPadding(num) {
  const r = ('0' + num).slice(-2)
  return r
}
