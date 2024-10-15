const { EmbedBuilder } = require('discord.js');
const { afkMap } = require('./afk');

module.exports = (client) => {
  client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    // If the user is AFK and sends a message (except !afk command)
    if (afkMap.has(message.author.id)) {
      if (!message.content.startsWith('!afk')) {
        const afkInfo = afkMap.get(message.author.id);
        const timeAFK = Date.now() - afkInfo.time;
        afkMap.delete(message.author.id);

        // Remove [AFK] from the user's nickname if possible
        if (message.member.manageable && message.member.nickname?.startsWith('[AFK] ')) {
          message.member.setNickname(message.member.nickname.replace('[AFK] ', '')).catch(console.error);
        }

        // Calculate how long they were AFK
        const minutes = Math.floor(timeAFK / 60000);
        const seconds = Math.floor((timeAFK % 60000) / 1000);
        const timeAFKString = minutes > 0 ? `${minutes} minute(s)` : `${seconds} second(s)`;

        const returnEmbed = new EmbedBuilder()
          .setColor(0x00FF00)
          .setTitle('Welcome Back!')
          .setDescription(`You were AFK for ${timeAFKString}. Your AFK status has been removed.`);

        return message.reply({ embeds: [returnEmbed] });
      }
    }

    // Check if the mentioned user is AFK
    message.mentions.users.forEach((user) => {
      if (afkMap.has(user.id)) {
        const afkInfo = afkMap.get(user.id);
        const mentionEmbed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('AFK Alert')
          .setDescription(`${user.tag} is currently AFK. **Reason** : ${afkInfo.reason} `)

        message.channel.send({ embeds: [mentionEmbed] });
      }
    });
  });
};
