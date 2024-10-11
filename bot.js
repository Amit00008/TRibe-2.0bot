const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const activity = require('./activity.js'); 

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,        
    GatewayIntentBits.GuildMessages,  
    GatewayIntentBits.MessageContent,  
  ],
});

// Use the token from the .env file
const TOKEN = 'MTI5MzUwNzE1NTYzODM1ODA2Nw.GmGYTW.WsWDjBo03llev9-A2y2KuvazKLy0fzLcTIiRWg';
const PREFIX = '!'; 

client.commands = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// when the bot starts we  calling activity func

activity(client);

// Listen for messages
client.on('messageCreate', message => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Check if the bot is mentioned in the message
  if (message.mentions.has(client.user) && !message.reference) {
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


client.login(TOKEN);
