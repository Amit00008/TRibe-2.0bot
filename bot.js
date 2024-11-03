const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, ActivityType, Events } = require('discord.js');
const config = require('./config.json');
const connectDB = require('./database');
const { afkUsers } = require('./commands/afk'); // Ensure this imports the Map correctly

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Load commands into a collection
client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Loaded command: ${command.name}`);
}

client.once('ready', async () => {
    try {
        await connectDB();
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity('your commands!', { type: ActivityType.Listening });
        console.log("Activity set!");
    } catch (error) {
        console.error("Error while connecting to database or setting activity:", error);
    }
});

// Command handling
client.on('messageCreate', message => {
    if (message.author.bot) return; // Ignore bot messages


    
    // Handle AFK status removal
    if (afkUsers.has(message.author.id)) {
        console.log(`${message.author.tag} is removing their AFK status.`);
        afkUsers.delete(message.author.id); // Remove the AFK status
        message.reply('You are no longer AFK.'); // Notify the user
        return; // Exit the function after removing AFK status
    }

    // Ignore messages without the specified prefix
    if (!message.content.startsWith(config.prefix)) return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Check if the command exists in the collection and execute it
    if (!client.commands.has(commandName)) return;

    try {
      client.commands.get(commandName).execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('There was an error executing that command.');
    }
    
    // Check if the mentioned user is AFK
    const mentionedUser = message.mentions.users.first();
    if (mentionedUser && afkUsers.has(mentionedUser.id)) {
      const reason = afkUsers.get(mentionedUser.id);
      message.reply(`${mentionedUser.tag} is currently AFK: ${reason}`);
    }
    if (commandName === 'exec') {
      // Check for permissions
     
      if (message.author.id !== config.owners) {
          return message.reply('You do not have permission to use this command.');
      }
  }
  });
  
// Log in to Discord with your app's token
client.login(config.token);
