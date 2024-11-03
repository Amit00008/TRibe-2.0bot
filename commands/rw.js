const { EmbedBuilder } = require('discord.js');
const WarningModel = require('../models/Warns');
const config = require('../config.json');

module.exports = {
    name: 'removewarn',
    description: 'Removes a warning from a user.',
    async execute(message, args) {
        // Check if the user provided the necessary arguments
        const user = message.mentions.users.first(); // Get the mentioned user
        const warnIndex = parseInt(args[1]); // Get the warning index

        // Validate the input
        if (!user || isNaN(warnIndex)) {
            return message.reply('Please mention a user and provide a valid warning index.');
        }

        try {
            // Fetch the user's warnings from MongoDB
            const warnings = await WarningModel.findOne({ userId: user.id, guildId: message.guild.id });
            if (!warnings || warnings.warnings.length < warnIndex || warnIndex < 1) {
                return message.reply('No warnings found for that user at that index.');
            }

            // Remove the specified warning
            const removedWarning = warnings.warnings.splice(warnIndex - 1, 1)[0];
            await warnings.save(); // Save the updated warnings back to the database

            // Create and send an embed message
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle(`Warning Removed`)
                .addFields(
                    { name: 'User', value: `${user.username}#${user.discriminator}`, inline: true },
                    { name: 'Reason', value: removedWarning.reason, inline: true },
                    { name: 'Moderator', value: message.author.username, inline: true }
                )
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });

            // Log the action
            console.log(`Removed warning ${warnIndex} for user ${user.tag} by ${message.author.tag}`);

        } catch (error) {
            console.error(error);
            message.reply('There was an error while trying to remove the warning.');
        }
    },
};
