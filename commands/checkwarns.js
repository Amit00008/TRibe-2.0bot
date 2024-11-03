const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Warn = require('../models/Warns'); // Import the Warn model

module.exports = {
  name: 'checkwarns',
  description: 'Checks the warnings of a user.',
  async execute(message, args) {
    // Check if the user has the permission to check warns
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply("You don't have permission to use this command.");
    }

    // Get the user to check
    const userToCheck = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);

    // If no user is mentioned or found by ID
    if (!userToCheck) {
      return message.reply("Please mention a user to check warnings or provide a valid user ID.");
    }

    // Fetch the warning document for the user
    let warnDoc;
    try {
      warnDoc = await Warn.findOne({ userId: userToCheck.id, guildId: message.guild.id });
    } catch (error) {
      console.error(error);
      return message.reply('There was an error fetching the warnings.');
    }

    // If no warnings found
    if (!warnDoc || warnDoc.warnings.length === 0) {
      return message.reply(`${userToCheck.user.tag} has no warnings.`);
    }

    // Create an embed to show the warnings
    const warningsEmbed = new EmbedBuilder()
      .setColor(0x00ccff) // Blue color
      .setTitle(`Warnings for ${userToCheck.user.tag}`)
      .setDescription(`Total Warnings: ${warnDoc.warnings.length}`)
      .setTimestamp()
      .setFooter({ text: `Checked by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

    // Add each warning to the embed
    warnDoc.warnings.forEach((warning, index) => {
      warningsEmbed.addFields(
        { name: `Warning ${index + 1}`, value: `Reason: ${warning.reason}\nDate: ${new Date(warning.date).toLocaleString()}\nModerator: ${warning.moderator}` }
      );
    });

    // Send the embed
    message.channel.send({ embeds: [warningsEmbed] });

    // Log the action
    console.log(`Checked warnings for ${userToCheck.user.tag} by ${message.author.tag}`);
  },
};
