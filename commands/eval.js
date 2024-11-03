const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'eval',
    description: 'Evaluate JavaScript code.(dev only)',
    async execute(message, args) {
        // Check if the user has permission to use this command (you can customize this)
        if (message.author.id !== config.owners[0]) {
            return message.reply('bruhhh, 😂You do not have permission to use this command.');
        }

        const code = args.join(' '); // Join all arguments to get the full code

        try {
            let result = eval(code); // Evaluate the code
            if (typeof result !== 'string') {
                result = require('util').inspect(result); // Convert non-string results to string
            }

            // Create an embed for better output display
            const embed = new EmbedBuilder()
                .setColor(0x00ccff)
                .setTitle('Eval Result')
                .addFields({
                    name: 'Input',
                        value: `\`\`\`javascript\n${code}\n\`\`\``, inline: false
                    }, {
                        name: 'Output',
                    value: `\`\`\`javascript\n${result}\n\`\`\``, inline: false
                })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            // Handle errors and send them back
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('Error')
                .addFields({ name: 'Input', value: `\`\`\`javascript\n${code}\n\`\`\`` })
                .addFields({ name: 'Error', value: `\`\`\`javascript\n${error}\n\`\`\`` })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        }
    },
};
