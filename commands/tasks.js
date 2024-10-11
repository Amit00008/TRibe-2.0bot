const { EmbedBuilder } = require('discord.js'); 

module.exports = {
  name: 'tasks',
  description: 'Displays Tut on how to Add tasks.',
  execute(message, args) {
    
    const TaskEmbed = new EmbedBuilder() 
      .setColor('#0099ff') 
      .setTitle('Task Guide')
      .setDescription('Here is a Guide for Making tasks List: [Watch video](https://www.youtube.com/shorts/ciBBt5nUDDI?si=ZSz7tHU7h5gdxbgE)')
      .setFooter({
        text: 'Tribe 2.0',
        iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
      });

    message.channel.send({ embeds: [TaskEmbed] }); 
  },
};
