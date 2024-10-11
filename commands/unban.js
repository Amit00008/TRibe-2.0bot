const { EmbedBuilder, PermissionsBitField, Colors } = require('discord.js');

module.exports = {
  name: 'unban',
  description: 'Unban a user from the server',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle('Permission Denied')
        .setDescription('You do not have permission to unban members.')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });
      return message.reply({ embeds: [noPermissionEmbed] });
    }

    const userId = args[0];
    if (!userId) {
      const noUserIdEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setTitle('Invalid User ID')
        .setDescription('Please provide a valid user ID to unban.')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });
      return message.reply({ embeds: [noUserIdEmbed] });
    }

    try {
      const user = await message.client.users.fetch(userId);
      await message.guild.members.unban(userId);

      const successEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle('User Unbanned')
        .setDescription(`User <@${userId}> has been unbanned successfully.`)
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });

      message.channel.send({ embeds: [successEmbed] });
    } catch (error) {
      let errorEmbed;

      if (error.code === 10013) {
        errorEmbed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle('Invalid User ID')
          .setDescription('The user ID provided is invalid or the user does not exist.')
          .setFooter({
            text: 'Tribe 2.0',
            iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
          });
      } else if (error.code === 50013) {
        errorEmbed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle('Permission Denied')
          .setDescription('I do not have permission to unban this user.')
          .setFooter({
            text: 'Tribe 2.0',
            iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
          });
      } else if (error.code === 10026) {
        errorEmbed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle('User Not Banned')
          .setDescription('This user is not banned.')
          .setFooter({
            text: 'Tribe 2.0',
            iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
          });
      } else {
        console.error(`Error unbanning user with ID ${userId}:`, error);
        errorEmbed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle('Failed to Unban User')
          .setDescription(`Failed to unban user with ID ${userId}: ${error.message}`)
          .setFooter({
            text: 'Tribe 2.0',
            iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
          });
      }

      message.reply({ embeds: [errorEmbed] });
    }
  },
};
