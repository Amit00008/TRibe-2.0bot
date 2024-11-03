const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unmute',
  description: 'Removes the mute (timeout) from a user.',
  async execute(message, args) {
    // Check if the user has the permission to manage roles
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply("You don't have permission to use this command.");
    }

    // Get the user to unmute
    const userToUnmute = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

    // If no user is mentioned or found by ID
    if (!userToUnmute) {
      return message.reply("Please mention a user to unmute or provide a valid user ID.");
    }

    // Check if the user is currently muted
    if (!userToUnmute.isCommunicationDisabled()) {
      return message.reply(`${userToUnmute.user.tag} is not muted.`);
    }

    // Unmute the user by removing the timeout
    await userToUnmute.timeout(null, `Unmuted by ${message.author.tag}`).catch(err => {
      console.error(err);
      return message.reply('There was an error trying to unmute the user.');
    });

    // Send confirmation message
    message.channel.send(`${userToUnmute.user.tag} has been unmuted.`);
  },
};
