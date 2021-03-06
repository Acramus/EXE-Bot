const main = require('../index').Main;
const functions = main.getFunctions();
const data = main.getData();
var token = data.token();
var prefix = data.prefix();
var osuApiKey = data.osuApiKey();
var owner = data.owner();
var allEvents = data.allEvents();
var debug = data.debug();
const wikis = {
    home: data.wikis().home,
    commands: data.wikis().commands,
    replies: data.wikis().replies,
    faq: data.wikis().faq,
    isEnabled: data.wikisEnabled()
};

const discord = require('discord.js');
const { Message, Client } = discord;
class disconnect {
    /**
     * 
     * @param {Message} msg 
     * @param {Client} client 
     */
    constructor(msg, client) {
        var messageArray = msg.content.split(' ');
        var command_prefix = messageArray[0];
        var args = messageArray.slice(1).join(' ');
        var command = command_prefix.replace(prefix, '');

        if (msg.channel.type == 'dm' || msg.channel.type == 'group') {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .setDescription('Commands only work in servers!')
                .setFooter('There is a good reason for this'));
        }
        if (!command_prefix.startsWith(prefix)) return;
        if (msg.member.user.id == owner.id) {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .setAuthor(client.user.username, client.user.avatarURL)
                .setDescription('Disconnecting...')
                .setTitle('Disconnect')).then(() => {
                    client.destroy();
                }).then(() => {
                    process.exit();
                });
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .setDescription('Bot owner only!')
                .setFooter('how did you found this command?')
            );
        }
    }
}
module.exports = disconnect;
