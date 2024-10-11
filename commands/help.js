const { EmbedBuilder } = require('discord.js'); 

module.exports = {
  name: 'help',
  description: 'Displays a list of available commands.',
  execute(message, args) {
    
    const helpEmbed = new EmbedBuilder() 
      .setColor('#0099ff') 
      .setTitle('Available Commands For Tribe 2.0')
      .setDescription('Here are the commands you can use:')
      .addFields(
        { name: 'Ban', value: 'Usage: `!ban @user`', inline: true },
        { name: 'Kick', value: 'Usage: `!kick @user`', inline: true },
        { name: 'Warn', value: 'Usage: `!warn @user`', inline: true },
        { name: 'Purge', value: 'Usage: `!purge <number>`', inline: true },
        { name: 'Mute', value: 'Usage: `!mute @user`', inline: true },
        { name: 'Unmute', value: 'Usage: `!unmute @user`', inline: true },
        { name: 'Unban', value: 'Usage: `!unban userID`', inline: true },
        { name: 'Check Warn', value: 'Usage: `!checkwarns @user`', inline: true },
        { name: 'removewarn', value: 'Usage: `!removewarn @user <warn-number>`', inline: true },
        { name: 'SetNick', value: 'Usage: `!setnick @user <new-nickname>`', inline: true }
  
      )
      .setFooter({
        text: 'Tribe 2.0',
        iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
      });

    message.channel.send({ embeds: [helpEmbed] }); 
  },
};
