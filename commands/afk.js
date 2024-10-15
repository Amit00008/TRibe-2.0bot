const { EmbedBuilder } = require('discord.js');
const afkMap = new Map();

module.exports = {
  name: 'afk',
  description: 'Set your AFK status',
  execute(message, args) {
    const reason = args.join(' ') || 'AFK';

    // If the user is already AFK, remove their AFK status
    if (afkMap.has(message.author.id)) {
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

    // Set the user's AFK status
    afkMap.set(message.author.id, { reason, time: Date.now() });

    // Add [AFK] to the user's nickname if possible
    if (message.member.manageable && !message.member.nickname?.startsWith('[AFK] ')) {
      message.member.setNickname(`[AFK] ${message.member.nickname || message.author.username}`).catch(console.error);
    }

    const afkEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('AFK Mode Activated')
      .setDescription(`${message.author.tag} is now AFK. Reason: ${reason}`)
      .setFooter({ text: 'You will be marked as AFK until you send a message.' });

    message.reply({ embeds: [afkEmbed] });
  },
};

// Export the afkMap to be used in mentionCheck.js
module.exports.afkMap = afkMap;
