const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kicks a user from the server.',
  async execute(message, args) {
    // Check if the user has the permission to kick members
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("You don't have permission to use this command.");
    }

    // Get the user to be kicked
    const userToKick = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

    // If no user is mentioned or found by ID
    if (!userToKick) {
      return message.reply("Please mention a user to kick or provide a valid user ID.");
    }

    // Check if the bot has permission to kick members
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("I don't have permission to kick members.");
    }

    // Prevent kicking administrators or higher roles
    if (userToKick.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("I can't kick an administrator.");
    }

    // Kick the user with optional reason
    const reason = args.slice(1).join(' ') || 'No reason provided';
    try {
      await userToKick.kick(reason);

      // Create an embed to show the kick information
      const kickEmbed = new EmbedBuilder()
        .setColor(0xff0000) // Red color
        .setTitle('User Kicked')
        .addFields(
          { name: 'Kicked User', value: `${userToKick.user.tag} (ID: ${userToKick.user.id})` },
          { name: 'Kicked By', value: `${message.author.tag}` },
          { name: 'Reason', value: reason }
        )
        .setTimestamp()
        .setFooter({ text: `Kicked by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

      // Send the embed
      message.channel.send({ embeds: [kickEmbed] });
    } catch (error) {
      console.error(error);
      message.reply('There was an error trying to kick this user.');cls
      
    }
  },
};
