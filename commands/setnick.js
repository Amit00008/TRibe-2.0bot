const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'setnick',
  description: 'Change the nickname of a user in the server',
  async execute(message, args) {
   
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
      return message.reply('You do not have permission to change nicknames.');
    }

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!user) {
      return message.reply('Please mention a valid user or provide their user ID.');
    }

    const newNick = args.slice(1).join(' ');
    if (!newNick) {
      return message.reply('Please provide a new nickname.');
    }

    try {
 
      await user.setNickname(newNick);
      message.channel.send(`Successfully changed ${user}'s nickname to "${newNick}".`);
    } catch (error) {
      console.error(`Failed to change nickname: ${error.message}`);
      message.reply(`Couldn't change ${user}'s nickname. Make sure I have the right permissions and the user is below my role in the hierarchy.`);
    }
  },
};
