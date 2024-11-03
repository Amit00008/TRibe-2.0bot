const { EmbedBuilder } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
    name: 'exec',
    description: 'Executes a shell command and returns the output.',
    async execute(message, args) {
        const command = args.join(' ');

        if (!command) {
            return message.reply('Please provide a command to execute.');
        }

        exec(command, (error, stdout, stderr) => {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Command Execution Result');

            if (error) {
                embed.addFields({ name: 'Error', value: `\`\`\`bash\n${error.message}\n\`\`\`` });
                return message.channel.send({ embeds: [embed] });
            }
            if (stderr) {
                embed.addFields({ name: 'Stderr', value: `\`\`\`bash\n${stderr}\n\`\`\`` });
                return message.channel.send({ embeds: [embed] });
            }

            embed.addFields({ name: 'Output', value: `\`\`\`bash\n${stdout}\n\`\`\`` });
            message.channel.send({ embeds: [embed] });
        });
    },
};
