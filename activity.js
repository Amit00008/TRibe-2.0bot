const { ActivityType } = require('discord.js');

module.exports = (client) => {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    
    // Set the bot's activity status
    client.user.setActivity('discord.gg/sharingaton', {
      type: ActivityType.Playing,
    });

    console.log('Activity set successfully!');
  });
};
