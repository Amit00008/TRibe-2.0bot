const { ActivityType } = require('discord.js');

module.exports = {
    name: 'setactivity',
    description: 'Sets the bot\'s activity status.',
    async execute(message, args) {
        // Check if the user has permission to manage messages (or any relevant permission)
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply('You do not have permission to set the bot activity.');
        }

        const activityType = args[0]?.toLowerCase(); // The first argument is the activity type
        const activityText = args.slice(1).join(' '); // The rest is the activity text

        // Validate activity type
        let type;
        switch (activityType) {
            case 'playing':
                type = ActivityType.Playing;
                break;
            case 'watching':
                type = ActivityType.Watching;
                break;
            case 'listening':
                type = ActivityType.Listening;
                break;
            case 'streaming':
                type = ActivityType.Streaming;
                break;
            default:
                return message.reply('Please specify a valid activity type: playing, watching, listening, or streaming.');
        }

        // Set the bot's activity
        await message.client.user.setActivity(activityText, { type });
        message.reply(`Set activity to **${activityType}**: **${activityText}**`);
    },
};
