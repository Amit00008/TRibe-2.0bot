const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'purge',
  description: 'Deletes a specified number of messages from the channel.',
  async execute(message, args) {
    // Check if the user has the permission to manage messages
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply("You don't have permission to use this command.");
    }

    // Get the number of messages to delete
    const amount = parseInt(args[0]);

    // Check if the amount is a valid number
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply('Please specify a number of messages to delete (1-100).');
    }

    // Delete messages
    const fetched = await message.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      message.channel.send('There was an error trying to purge messages in this channel!');
    });

    // Send feedback about the purge
    if (fetched.size > 0) {
      message.channel.send(`Successfully deleted ${fetched.size} message(s).`).then(msg => {
        // Optionally, delete the feedback message after a short delay
        setTimeout(() => msg.delete(), 5000);
      });
    } else {
      message.channel.send('No messages were deleted. Please ensure you are trying to delete messages that are not older than 14 days.');
    }
  },
};
