// afk.js
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

// Store AFK status in a Map
const afkUsers = new Map();

module.exports = {
    name: 'afk',
    description: 'Sets a user\'s AFK status.',
    async execute(message, args) {
        const userToSet = message.mentions.users.first() || message.author;
        const reason = args.slice(1).join(' ') || 'No reason provided';

        // Set the user's AFK status
        afkUsers.set(userToSet.id, reason);

        const embed = new EmbedBuilder()
            .setColor(0x00ccff)
            .setTitle(`${userToSet.tag} is now AFK`)
            .setDescription(`Reason: ${reason}`)
            .setTimestamp()
            .setFooter({ text: 'You will be removed from the AFK list once you send a message.' });

        await message.channel.send({ embeds: [embed] });
        // Change the user's nickname to indicate AFK status
        if (message.guild) {
            const member = message.guild.members.cache.get(userToSet.id);
            if (member) {
            try {
                await member.setNickname(`[AFK] ${userToSet.username}`);
            } catch (error) {
                console.error('Failed to change nickname:', error);
                message.channel.send('Failed to change nickname.');
            }
            }
        }
    },
};

// Export the afkUsers Map
module.exports.afkUsers = afkUsers;
