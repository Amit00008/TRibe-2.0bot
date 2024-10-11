const { PermissionsBitField, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  name: 'checkwarns',
  description: 'Check warnings of a user',
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply('You do not have permission to check warnings.');
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply('Please mention a valid member.');
    }

    const warnings = warnData[target.id];

    if (!warnings || warnings.length === 0) {
      return message.reply(`${target.user.tag} has no warnings.`);
    }

    const warnList = warnings.map((warn, index) => `${index + 1}. **Reason**: ${warn.reason} | **By**: ${warn.moderator} | **Date**: ${warn.date}`).join('\n');

    const embed = new EmbedBuilder()
      .setTitle(`${target.user.tag}'s Warnings`)
      .setDescription(warnList)
      .setColor(Colors.Yellow);  

    message.channel.send({ embeds: [embed] });
  },
};

