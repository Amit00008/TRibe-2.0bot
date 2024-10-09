const { PermissionsBitField, EmbedBuilder } = require('discord.js'); // Import necessary classes

module.exports = {
  name: 'ban',
  description: 'Bans a user from the server.',
  usage: '<user> [reason]',
  async execute(message, args) {
    // Check if the user has permission to ban members
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('You do not have permission to use this command.');
    }

    // Check if a user is mentioned
    const userToBan = message.mentions.members.first();
    if (!userToBan) {
      return message.reply('Please mention a user to ban.');
    }

    // Check if the bot has permission to ban the user
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('I do not have permission to ban members.');
    }

    // Get the reason for the ban, defaulting to "No reason provided" if not specified
    const reason = args.slice(1).join(' ') || 'No reason provided';

    // Ban the user
    await userToBan.ban({ reason });

    // Send a DM to the user with the ban reason and appeal link
    try {
      const appealLink = 'https://discord.gg/3PKDbyqxjz'; // Replace with your actual appeal link
      const dmEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('You have been banned')
        .setDescription(`You have been banned from **${message.guild.name}**.`)
        .addFields(
          { name: 'Reason', value: reason },
          { name: 'Appeal Link', value: appealLink }
        )
        .setFooter({ text: 'If you think this is a mistake, please click the link above to appeal.' });

      await userToBan.send({ embeds: [dmEmbed] });
      console.log(`DM sent to ${userToBan.user.tag}`); // Log successful DM
    } catch (err) {
      // Handle error if unable to send DM
      console.error(`Could not send DM to ${userToBan.user.tag}: `, err);
      message.channel.send(`Could not send a DM to ${userToBan.user.tag}. They may have DMs disabled.`);
    }

    // Notify in the channel that the user has been banned
    message.channel.send(`${userToBan.user.tag} has been banned from the server.`);
  },
};
