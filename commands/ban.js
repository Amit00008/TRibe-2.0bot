const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { footer, color } = require('../config.json');

module.exports = {
  name: 'ban',
  description: 'Bans a user from the server.',
  async execute(message, args) {
    // Check if the user has the permission to ban members
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      console.log("User does not have ban permissions.");
      return message.reply("You don't have permission to use this command.");
    }

    // Get the user to be banned
    const userToBan = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

    // If no user is mentioned or found by ID
    if (!userToBan) {
      console.log("No user mentioned or invalid user ID.");
      return message.reply("Please mention a user to ban or provide a valid user ID.");
    }

    // Check if the bot has permission to ban members
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      console.log("Bot does not have ban permissions.");
      return message.reply("I don't have permission to ban members.");
    }
    // Check if the bot has permission to ban members
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("I don't have permission to ban members.");
    }

    // Prevent banning administrators or higher roles
    if (userToBan.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("I can't ban an administrator.");
    }

    // Ban the user with optional reason
    const reason = args.slice(1).join(' ') || 'No reason provided';
    try {
      await userToBan.ban({ reason });

      // Create an embed to show the ban information
      const banEmbed = new EmbedBuilder()
        .setColor(0xff0000) // Red color
        .setTitle('User Banned')
        .addFields(
          { name: 'Banned User', value: `${userToBan.user.tag} (ID: ${userToBan.user.id})` },
          { name: 'Banned By', value: `${message.author.tag}` },
          { name: 'Reason', value: reason }
        )
        .setTimestamp()
        .setFooter({ text: `Banned by ${message.author.tag} | ${footer}`, iconURL: message.author.displayAvatarURL() });

      // Send the embed
      message.channel.send({ embeds: [banEmbed] });
    } catch (error) {
      console.error(error);
      message.reply('There was an error trying to ban this user.');
    }
  },
};
