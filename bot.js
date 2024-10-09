// Load environment variables from .env file
require('dotenv').config();

// Import the required classes from discord.js
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,         // Allows the bot to receive guild events
    GatewayIntentBits.GuildMessages,  // Allows the bot to receive guild message events
    GatewayIntentBits.MessageContent,  // Allows the bot to read message content
  ],
});

// Use the token from the .env file
const TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = '!'; // Your command prefix

// Load commands from the commands directory
client.commands = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// When the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`); // Log the bot's username to the console

  // Set the bot's status
  client.user.setActivity('YOUR BOT STATUS', { type: 'PLAYING' });
  console.log('Status set to playing!'); // Log the status update
});

// Listen for messages
client.on('messageCreate', message => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Check if the bot is mentioned in the message
  if (message.mentions.has(client.user)) {
    return message.channel.send(`My prefix is \`${PREFIX}\``); // Reply with the prefix
  }

  // Ignore messages that don't start with the prefix
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/); // Split the command and arguments
  const commandName = args.shift().toLowerCase(); // Get the command name

  const command = client.commands.get(commandName); // Get the command from the map

  // If the command doesn't exist, return
  if (!command) return;

  try {
    command.execute(message, args); // Execute the command with the message and args
  } catch (error) {
    console.error(error); // Log any errors
    message.reply('There was an error executing that command!'); // Inform the user
  }
});

// Log the bot in using the token
client.login(TOKEN);
