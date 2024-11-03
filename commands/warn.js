const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Warn = require('../models/Warns'); // Import the Warn model

module.exports = {
  name: 'warn',
  description: 'Warns a user and stores the warning in the database.',
  async execute(message, args) {
    // Check if the user has the permission to warn members
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("You don't have permission to use this command.");
    }

    // Get the user to be warned
    const userToWarn = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

    // If no user is mentioned or found by ID
    if (!userToWarn) {
      return message.reply("Please mention a user to warn or provide a valid user ID.");
    }

    // Get the reason for the warning
    const reason = args.slice(1).join(' ') || 'No reason provided';

    // Find or create the warning document for the user
    let warnDoc = await Warn.findOne({ userId: userToWarn.id, guildId: message.guild.id });
  
    if (!warnDoc) {
      warnDoc = new Warn({ userId: userToWarn.id, guildId: message.guild.id, warnings: [] });
    }

    // Add the warning to the document
    warnDoc.warnings.push({
      reason,
      date: new Date(),
      moderator: message.author.tag,
    });

    // Save the document
    try {
      await warnDoc.save();
    } catch (error) {
      console.error(error);
      return message.reply('There was an error saving the warning.');
    }

    // Create an embed to show the warning information
    const warnEmbed = new EmbedBuilder()
      .setColor(0xffcc00) // Yellow color
      .setTitle('User Warned')
      .addFields(
        { name: 'Warned User', value: `${userToWarn.user.tag} (ID: ${userToWarn.user.id})` },
        { name: 'Warned By', value: `${message.author.tag}` },
        { name: 'Reason', value: reason }
      )
      .setTimestamp()
      .setFooter({ text: `Warned by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

    // Send the embed
    message.channel.send({ embeds: [warnEmbed] });

    // Log the action
    console.log(`Warning issued to ${userToWarn.user.tag} by ${message.author.tag} for: ${reason}`);
  },
};
