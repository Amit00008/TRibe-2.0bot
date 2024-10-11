const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'mute',
  description: 'mute a user in the server for a specified duration',
  async execute(message, args) {
  
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply('You do not have permission to timeout members.');
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply('Please mention a valid user to timeout.');
    }

    const time = parseInt(args[1], 10); 
    if (!time || isNaN(time)) {
      return message.reply('Please provide a valid duration (in minutes) for the timeout.');
    }

    const timeoutDuration = time * 60 * 1000; 

    try {
      await target.timeout(timeoutDuration, `Mute by ${message.author.tag}`);
      message.channel.send(`${target.user.tag} has been muted for ${time} minutes.`);

      
      console.log(`Timed out ${target.user.tag} for ${time} minutes by ${message.author.tag}`);
    } catch (error) {
      console.error(`Error timing out user: ${target.user.tag}`, error);
      message.reply(`Failed to timeout ${target.user.tag}: ${error.message}`);
    }
  },
};
