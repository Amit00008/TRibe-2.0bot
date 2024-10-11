const { PermissionsBitField, ActivityType } = require('discord.js');

const allowedUsers = ['1040241412307955754'];

module.exports = {
  name: 'setactivity',
  description: 'Change the bot\'s activity status.',
  execute(message, args) {
    if (!allowedUsers.includes(message.author.id)) {
      return message.reply('You do not have permission to change the bot\'s activity status.');
    }

    const activityType = args[0]; 
    const activityName = args.slice(1).join(' ');

    if (!activityType || !activityName) {
      return message.reply('Please provide a valid activity type and name.');
    }

    const validTypes = {
      PLAYING: ActivityType.Playing,
      WATCHING: ActivityType.Watching,
      LISTENING: ActivityType.Listening,
      STREAMING: ActivityType.Streaming,
    };

    const typeKey = activityType.toUpperCase();
    if (!validTypes[typeKey]) {
      return message.reply('Invalid activity type. Please use PLAYING, WATCHING, LISTENING, or STREAMING.');
    }

    console.log(`Changing activity to: ${typeKey} ${activityName}`);

    // Set the bot's activity status
    message.client.user.setActivity(activityName, { type: validTypes[typeKey] });
    
    console.log(`Bot's activity set to: ${typeKey} ${activityName}`);
    message.channel.send(`Bot's activity status has been changed to: ${typeKey} ${activityName}`);
  },
};
