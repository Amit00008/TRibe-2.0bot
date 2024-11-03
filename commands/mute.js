const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'mute',
  description: 'Temporarily mutes a user for a specified duration.',
  async execute(message, args) {
    // Check if the user has the permission to manage roles
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply("You don't have permission to use this command.");
    }

    // Get the user to mute
    const userToMute = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

    // If no user is mentioned or found by ID
    if (!userToMute) {
      return message.reply("Please mention a user to mute or provide a valid user ID.");
    }

    // Get the duration
    const duration = parseInt(args[1]);
    if (isNaN(duration) || duration <= 0) {
      return message.reply('Please specify a valid duration in seconds for the mute.');
    }

    // Mute the user by applying a timeout
    await userToMute.timeout(duration * 1000, `Muted by ${message.author.tag}`).catch(err => {
      console.error(err);
      return message.reply('There was an error trying to mute the user.');
    });

    // Send confirmation message
    message.channel.send(`${userToMute.user.tag} has been muted for ${duration} seconds.`);
  },
};
