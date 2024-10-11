const fs = require('fs');
const { EmbedBuilder, Colors } = require('discord.js');
const warnData = require('../warnings.json');

module.exports = {
  name: 'removewarn',
  description: 'Remove a user’s specific warning',
  execute(message, args) {
    if (!message.member.permissions.has('KICK_MEMBERS')) {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle('Permission Denied')
        .setDescription('You do not have permission to remove warnings.')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });
      return message.reply({ embeds: [noPermissionEmbed] });
    }

    const target = message.mentions.members.first();
    if (!target) {
      const noTargetEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setTitle('Invalid Member')
        .setDescription('Please mention a valid member.')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });
      return message.reply({ embeds: [noTargetEmbed] });
    }

    const warningIndex = parseInt(args[1], 10) - 1;

    if (!warnData[target.id] || warnData[target.id].length === 0) {
      const noWarningsEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setTitle('No Warnings')
        .setDescription(`${target.user.tag} has no warnings to remove.`)
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });
      return message.reply({ embeds: [noWarningsEmbed] });
    }

    if (warningIndex < 0 || warningIndex >= warnData[target.id].length) {
      const invalidIndexEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setTitle('Invalid Warning Index')
        .setDescription('Invalid warning index.')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });
      return message.reply({ embeds: [invalidIndexEmbed] });
    }

    warnData[target.id].splice(warningIndex, 1);
    fs.writeFileSync('./warnings.json', JSON.stringify(warnData, null, 2));

    const successEmbed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle('Warning Removed')
      .setDescription(`Warning ${warningIndex + 1} has been removed for ${target.user.tag}.`)
      .setFooter({
        text: 'Tribe 2.0',
        iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
      });

    message.channel.send({ embeds: [successEmbed] });
  },
};
