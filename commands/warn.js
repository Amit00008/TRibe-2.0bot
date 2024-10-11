const fs = require('fs');
const { PermissionsBitField, EmbedBuilder, Colors } = require('discord.js');
const warnData = require('../warnings.json');

module.exports = {
  name: 'warn',
  description: 'Warn a user and track their warnings. Auto-bans after 3 warnings and clears warnings after ban.',
  execute(message, args) {
    // Check if the user has the permission to warn members
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle('Permission Denied')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        })
        .setDescription('You do not have permission to warn members.');
      return message.reply({ embeds: [noPermissionEmbed] });
    }

    // Ensure a valid member is mentioned (not in reply)
    const target = message.mentions.members.first();
    if (!target) {
      const noMemberEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setTitle('No Member Mentioned')
        .setFooter({
          text: 'Tribe 2.0',
          iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
        })
        .setDescription('Please mention a valid member to warn.');
      return message.reply({ embeds: [noMemberEmbed] });
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    // Initialize warning data for the user if not already present
    if (!warnData[target.id]) {
      warnData[target.id] = [];
    }

    // Add the warning to the user's warning data
    warnData[target.id].push({
      moderator: message.author.tag,
      reason: reason,
      date: new Date().toLocaleString(),
    });

    // Write updated warnings data to file
    fs.writeFileSync('./warnings.json', JSON.stringify(warnData, null, 2));

    // Create and send the warning embed
    const warnEmbed = new EmbedBuilder()
      .setColor(Colors.Yellow)
      .setTitle('User Warned')
      .addFields(
        { name: 'Warned User', value: `${target.user.tag}` },
        { name: 'Reason', value: reason },
        { name: 'Moderator', value: message.author.tag },
        { name: 'Date', value: new Date().toLocaleString() }
      )
      .setFooter({
        text: 'Tribe 2.0',
        iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
      });

    message.channel.send({ embeds: [warnEmbed] });

    // Notify the user via DM about the warning
    target.send(`You have been warned for: ${reason}`).catch(err => {
      console.log(`Could not send DM to ${target.user.tag}: ${err.message}`);
    });

    // Check if the user has accumulated 3 warnings
    if (warnData[target.id].length >= 3) {
      
      target.send(`You have received 3 warnings and will be banned from the server for repeated violations. Please review the server rules to avoid future issues.
If you believe this is a mistake, please submit an unban appeal at: 
https://discord.gg/3PKDbyqxjz`).then(() => {

        // Ban the user
        target.ban({ reason: `Accumulated 3 warnings. Last reason: ${reason}` })
          .then(() => {
            const banEmbed = new EmbedBuilder()
              .setColor(Colors.Red)
              .setTitle('User Banned')
              .setDescription(`${target.user.tag} has been banned for receiving 3 warnings.`)
              .setFooter({
                text: 'Tribe 2.0',
                iconURL: 'https://media.discordapp.net/attachments/1285399735967940720/1285399815055998977/a_ff978afb25fb15001f0455355f51aedf.gif?ex=670a6e1d&is=67091c9d&hm=4c0c85e48cbccb2ef1ddab2878741a92f2c27d663c1bd69d5b2561e1a6777249&=&width=160&height=160',
              });

            message.channel.send({ embeds: [banEmbed] });

            
            delete warnData[target.id];
            fs.writeFileSync('./warnings.json', JSON.stringify(warnData, null, 2));
            console.log(`Warnings for ${target.id} cleared after ban.`);
          })
          .catch(error => {
            console.error(`Failed to ban ${target.user.tag}: ${error.message}`);
            message.channel.send(`Failed to ban ${target.user.tag}. Please check my permissions.`);
          });
      }).catch(err => {
        console.log(`Could not send ban DM to ${target.user.tag}: ${err.message}`);
      });
    }
  },
};
