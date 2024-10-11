const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'Unmute  a user',
  async execute(message, args) {
   
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply('You do not have permission to Unmute.');
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply('Please mention a valid user to Unmute.');
    }

  
    if (!target.isCommunicationDisabled()) {
      return message.reply('This user is not in timeout.');
    }

    try {
      await target.timeout(null);
      message.channel.send(`${target.user.tag}'s mute has been removed.`);

    
      console.log(`Removed mute for ${target.user.tag} by ${message.author.tag}`);
    } catch (error) {
      console.error(`Error removing timeout for user: ${target.user.tag}`, error);
      message.reply(`Failed to remove timeout for ${target.user.tag}: ${error.message}`);
    }
  },
};
