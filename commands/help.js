const { EmbedBuilder } = require('discord.js'); // Updated import

module.exports = {
  name: 'help',
  description: 'Displays a list of available commands.',
  execute(message, args) {
    // Create an embed message
    const helpEmbed = new EmbedBuilder() // Use EmbedBuilder instead of MessageEmbed
      .setColor('#0099ff') // You can choose any color you want
      .setTitle('Available Commands For Tribe 2.0')
      .setDescription('Here are the commands you can use:')
      .addFields(
        { name: 'Ban', value: 'Usage: `!ban @user`', inline: true },
        { name: 'Kick', value: 'Usage: `!kick @user`', inline: true },
        { name: 'Warn', value: 'Usage: `!warn @user`', inline: true },
        { name: 'Purge', value: 'Usage: `!purge <number>`', inline: true },
        { name: 'Mute', value: 'Usage: `!mute @user`', inline: true },
        { name: 'Unmute', value: 'Usage: `!unmute @user`', inline: true },
        { name: 'Unban', value: 'Usage: `!unban userID`', inline: true }
      )
      .setFooter({ text: `The Tribe 2.0 Official Bot` }); // Use footer method with object

    message.channel.send({ embeds: [helpEmbed] }); // Send the embed message
  },
};
