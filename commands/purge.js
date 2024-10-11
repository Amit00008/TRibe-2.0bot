const { EmbedBuilder, PermissionsBitField, Colors } = require('discord.js');

module.exports = {
  name: 'purge',
  description: 'Delete a specified number of messages from the channel',
  async execute(message, args) {

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle('Permission Denied')
        .setDescription('You do not have permission to manage messages.')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });
      return message.reply({ embeds: [noPermissionEmbed] });
    }

    const deleteCount = parseInt(args[0], 10);
    if (!deleteCount || deleteCount < 1 || deleteCount > 200) {
      const invalidNumberEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setTitle('Invalid Number')
        .setDescription('Please provide a number between 1 and 200 for the number of messages to delete.')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });
      return message.reply({ embeds: [invalidNumberEmbed] });
    }

    try {
      const deletedMessages = await message.channel.bulkDelete(deleteCount, true); 
      const successEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle('Messages Deleted')
        .setDescription(`Successfully deleted ${deletedMessages.size} messages.`)
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });

      message.channel.send({ embeds: [successEmbed] }).then(msg => {
        setTimeout(() => msg.delete(), 5000); 
      });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle('Failed to Delete Messages')
        .setDescription(`An error occurred: ${error.message}`)
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        });

      message.reply({ embeds: [errorEmbed] });
    }
  },
};
