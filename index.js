const crypto = require( 'hypercore-crypto');
const b4a = require('b4a');
const ipc = require('hyper-ipc-secure');
const node = ipc();

global.kp = crypto.keyPair(crypto.data(b4a.from('seedy')));

require('dotenv').config(); //initialize dotenv
const discord = require('discord.js');
console.log({ discord });
const client = new discord.Client({intents: [discord.GatewayIntentBits.Guilds,discord. GatewayIntentBits.GuildMessages, discord.GatewayIntentBits.GuildMessageReactions] }); //create new client
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on('messageCreate', console.log);

function splitAndCombine(inputString) {
  const lines = inputString.split('\n');
  const chunks = [];
  let currentChunk = '';

  for (const line of lines) {
    const lineLength = line.length;

    if (currentChunk.length + lineLength <= 1000) {
      currentChunk += line + '\n';
    } else {
      chunks.push(currentChunk);
      currentChunk = line + '\n';
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

//node.lbserve(parsed, 'testy', inp=>{console.log(inp); return inp});
node.lbserve(node.getSub(kp, 'discord'), node.getSub(kp, 'serverbla'), 'discord', (inp)=>{
  const {channel, message} = inp;
  const chunks = splitAndCombine(message);
  chunks.forEach(message=>{
    ( client.channels.cache.get(channel) ).send(message)
  })
  return inp;
})

console.log(process.env.DISCORD_TOKEN)
//make sure this line is the last line
client.login(process.env.DISCORD_TOKEN); //login bot using token
