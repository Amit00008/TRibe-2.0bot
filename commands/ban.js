const { PermissionsBitField, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban a member from the server',
  async execute(message, args) {
    // Check if the user has the permission to ban members
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      const permissionEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle('Permission Denied')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        })
        .setDescription('You do not have permission to ban members.');
      return message.reply({ embeds: [permissionEmbed] });
    }

    // Check if a user was mentioned or a valid ID was passed
    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const reason = args.slice(1).join(' ') || 'No reason provided';

    // Validate if a target is provided
    if (!target) {
      const noMemberEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setTitle('Invalid Member')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        })
        .setDescription('Please mention a valid member or provide a valid user ID to ban.');
      return message.reply({ embeds: [noMemberEmbed] });
    }

    try {
      // Send a DM to the user being banned
      const dmEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle('You Have Been Banned')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        })
        .setDescription(`You have been banned from **Tribe 2.0** for the following reason: **${reason}**`)
        .addFields({
          name: 'Unban Appeal',
          value: '[Submit your appeal here](https://discord.gg/3PKDbyqxjz)',
        });

      await target.send({ embeds: [dmEmbed] });

      // Ban the member
      await target.ban({ reason });

      const banSuccessEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle('Member Banned')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        })
        .setDescription(`${target.user.tag} has been banned from the server for: **${reason}**`);

      message.channel.send({ embeds: [banSuccessEmbed] });
    } catch (error) {
      console.log(`Could not send DM to ${target.user.tag}: ${error.message}`);

      try {
        // Ban the member if DM fails
        await target.ban({ reason });

        const dmFailedEmbed = new EmbedBuilder()
          .setColor(Colors.Green)
          .setTitle('Member Banned')
          .setFooter({
            text: 'Tribe 2.0',
            iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
          })
          .setDescription(`${target.user.tag} has been banned from the server, but the DM could not be sent.`);

        message.channel.send({ embeds: [dmFailedEmbed] });
      } catch (banError) {
        const banFailedEmbed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle('Ban Failed')
          .setFooter({
            text: 'Tribe 2.0',
            iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
          })
          .setDescription(`Failed to ban ${target.user.tag}: ${banError.message}`);

        message.reply({ embeds: [banFailedEmbed] });
      }
    }
  },
};
