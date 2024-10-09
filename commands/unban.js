const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'unban',
  description: 'Unbans a user from the server.',
  usage: '<user_id>',
  async execute(message, args) {
    // Check if the user has permission to unban members
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('You do not have permission to use this command.');
    }

    // Check if an ID is provided
    const userId = args[0];
    if (!userId) {
      return message.reply('Please provide the ID of the user to unban.');
    }

    // Attempt to unban the user
    try {
      await message.guild.bans.remove(userId);

      // Optionally send a DM to the user notifying them of their unban
      const unbannedUser = await message.guild.members.fetch(userId).catch(() => null);
      if (unbannedUser) {
        const dmEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle('You have been unbanned')
          .setDescription(`You have been unbanned from **${message.guild.name}**.`)
          .setFooter({ text: 'We hope to see you back!' });

        await unbannedUser.send({ embeds: [dmEmbed] });
        console.log(`DM sent to ${unbannedUser.user.tag}`); // Log successful DM
      } else {
        console.log(`User with ID ${userId} does not exist in the server.`); // Log user not found
      }

      // Notify in the channel that the user has been unbanned
      message.channel.send(`User with ID ${userId} has been unbanned from the server.`);
    } catch (err) {
      // Handle error if unable to unban
      console.error(`Failed to unban user with ID ${userId}: `, err);
      message.channel.send(`Failed to unban user with ID ${userId}. They may not be banned.`);
    }
  },
};
