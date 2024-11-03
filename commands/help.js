const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Lists all available commands.',
    execute(message) {
        const commands = message.client.commands; // Access the commands collection
        const embed = new EmbedBuilder()
            .setColor(0x00ccff)
            .setTitle('Available Commands for Tribe 2.0')
            .setDescription('Here is a list of all commands you can use:')
            .setTimestamp()
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() });

        // Loop through the commands and add them to the embed
        commands.forEach(command => {
            embed.addFields({
                name: `${command.name}`,
                value: `${command.description || 'No description provided.'}`,
                inline: true
            });
        });

        // Send the embed in the channel
        message.channel.send({ embeds: [embed] });
    },
};
