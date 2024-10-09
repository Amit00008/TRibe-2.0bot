module.exports = {
    name: 'ping',
    description: 'Ping command!',
    execute(message, args) {
      message.channel.send('Pong!'); // Reply with "Pong!" when the command is invoked
    },
  };
  