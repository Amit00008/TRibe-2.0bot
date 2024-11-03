const os = require('os');
const { EmbedBuilder } = require('discord.js');
let prettyMs;

module.exports = {
    name: 'stats',
    description: 'Displays detailed server and system stats (dev only)',
    async execute(message) {
        prettyMs = await import('pretty-ms').then(module => module.default);
        const uptime = os.uptime() * 1000; // in milliseconds
        const botUptime = message.client.uptime; // bot's uptime in milliseconds
        const totalMemory = os.totalmem() / (1024 ** 3); // in GB
        const freeMemory = os.freemem() / (1024 ** 3); // in GB
        const usedMemory = totalMemory - freeMemory;
        const cpuModel = os.cpus()[0].model;
        const cpuCores = os.cpus().length;
        const cpuUsage = process.cpuUsage().system / 1000000; // in ms
        const platform = os.platform();
        const arch = os.arch();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Server and System Stats')
            .setThumbnail(message.client.user.displayAvatarURL())
            .addFields(
                { name: 'Operating System', value: `${platform} (${arch})`, inline: true },
                { name: 'CPU Model', value: cpuModel, inline: true },
                { name: 'CPU Cores', value: `${cpuCores}`, inline: true },
                { name: 'CPU Usage', value: `${cpuUsage.toFixed(2)}%`, inline: true },
                { name: 'Total RAM', value: `${totalMemory.toFixed(2)} GB`, inline: true },
                { name: 'Used RAM', value: `${usedMemory.toFixed(2)} GB`, inline: true },
                { name: 'Free RAM', value: `${freeMemory.toFixed(2)} GB`, inline: true },
                { name: 'System Uptime', value: prettyMs(uptime), inline: true },
                { name: 'Bot Uptime', value: prettyMs(botUptime), inline: true },
                { name: 'Server', value: message.guild.name, inline: true },
                { name: 'Total Members', value: `${message.guild.memberCount}`, inline: true }
            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
