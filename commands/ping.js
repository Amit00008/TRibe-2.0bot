module.exports = {
    name: 'ping',
    description: 'Replies with Pong!',
    async execute(message, args) {
        const sentMessage = await message.channel.send('Pinging...');
    
        // Calculate the round-trip latency
        const latency = sentMessage.createdTimestamp - message.createdTimestamp;
        
        // Show latency and WebSocket (API) ping
        sentMessage.edit(`Pong! Latency is ${latency}ms. API Latency is ${Math.round(message.client.ws.ping)}ms.`);
    },
  };
  