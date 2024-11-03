const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unban',
  description: 'Unbans a user from the server.',
  async execute(message, args) {
    // Check if the user has permission to ban members
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply("You don't have permission to use this command.");
    }

    // Check if a user ID is provided
    const userId = args[0];
    if (!userId) {
      return message.reply("Please provide a user ID to unban.");
    }

    // Attempt to unban the user
    try {
      // Unban the user
      await message.guild.bans.remove(userId);
      message.channel.send(`Successfully unbanned <@${userId}>.`);

      // Fetch the user to send a DM
      const user = await message.client.users.fetch(userId);

      // Send a DM to the user
      try {

        await user.send(`You have been unbanned from **${message.guild.name}**. Welcome back!`);
        
      } catch (error) {
        message.reply(`I couldn't send a DM to the user. They have been unbanned from the server.`, "\nError:", ```${error}```);
        
      }

    } catch (error) {
      console.error(error);
      // Check if the user is banned
      if (error.code === 10026) {
        return message.reply("That user is not banned or the ID is invalid.");
      }
      message.reply("There was an error trying to unban that user. Please check if the ID is correct and if the user is banned.");
    }
  },
};
