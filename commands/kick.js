const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kick a user from the server',
  async execute(message, args) {
    if (!message.member.permissions.has('KICK_MEMBERS')) {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle('Permission Denied')
        .setDescription('You do not have permission to kick members.')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });
      return message.reply({ embeds: [noPermissionEmbed] });
    }

    const target = message.mentions.members.first();
    if (!target) {
      const noMemberEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setTitle('No Member Mentioned')
        .setDescription('Please mention a valid member to kick.')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });
      return message.reply({ embeds: [noMemberEmbed] });
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      await target.kick(reason);

      try {
        await target.send(`You have been kicked from the server for the following reason: ${reason}`);
      } catch (err) {
        console.log(`Could not send DM to ${target.user.tag}:`, err.message);
      }

      const kickEmbed = new EmbedBuilder()
        .setColor(Colors.Orange)
        .setTitle('User Kicked')
        .setDescription(`${target.user.tag} has been kicked.`)
        .addFields({ name: 'Reason', value: reason })
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });

      message.channel.send({ embeds: [kickEmbed] });
    } catch (err) {
      console.error(`Failed to kick ${target.user.tag}:`, err);

      const failEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle('Kick Failed')
        .setDescription(`I could not kick ${target.user.tag}. Please check my permissions and try again.`)
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });

      message.channel.send({ embeds: [failEmbed] });
    }
  },
};
