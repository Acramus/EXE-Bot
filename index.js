//STARTING
console.log('Starting...');
/************************************************
*                                               *
*                     DATA                      *
*                                               *
************************************************/

var servers                                   = {}
const main                                    = require("./scripts/");
const data                                    = new main.Main().getData();
var token                                     = data.token();
var prefix                                    = data.prefix();
var osuApiKey                                 = data.osuApiKey();
var owner                                     = data.owner();
var allEvents                                 = data.allEvents();
var debug                                     = data.debug();
const wikis                                   = {
    home: data.wikis().home,
    commands: data.wikis().commands,
    replies: data.wikis().replies,
    faq: data.wikis().faq,
    isEnabled: data.wikis().isEnabled
};
/************************************************
*                                               *
*                    MODULES                    *
*                                               *
************************************************/

const discord                                 = require('discord.js');
const { GuildMember }                         = require('discord.js');
const _randomCat                              = require('random.cat.js');
const _randomDog                              = require('random.dog.js');
//const events                                  = require('./scripts/events');
const voiceCommands                           = require('./commands/voiceCommands');
const osuCommands                             = require('./commands/osuCommands');

const client                                  = new discord.Client({
    apiRequestMethod: 'sequential',
    shardId: 0,
    shardCount: 0,
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    messageSweepInterval: 0,
    fetchAllMembers: false,
    disableEveryone: false,
    sync: false,
    restWsBridgeTimeout: 5000,
    restTimeOffset: 500,
    disabledEvents: [],
    ws: {
        large_threshold: 100,
        compress: false
    },
    http: {
        version: 7,
        cdn: 'https://cdn.discordapp.com',
        host: 'https://discordapp.com'
    }
});
const randomCat                               = _randomCat.api();
const randomDog                               = _randomDog.api();

const events = new main.Main().getEvents();
new events(client);

client.setInterval((e) => {
    client.user.setPresence({
        status: "online",
        afk: false,
        game: {
            name: prefix + "help | " + prefix + "invite | " + client.guilds.size + " Servers",
            url: "https://www.twitch.tv/extremeexploit_",
        }
    })
}, 60000);

/************************************************
*                                               *
*                   FUNCTIONS                   *
*                                               *
************************************************/

/**
 * @param {string} text
 */
function clean(text) {
    if (typeof (text) == 'string')
        return text
            .replace(token, '*TOKEN*')
            .replace(osuApiKey, '*OSUAPIKEY*');
    else
        return text;
}

/**
 * @param {string} string
 */
function reverseString(string) {
    var splitString = string.split('');
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join('');
    return joinArray;
}

/**
 * @param {GuildMember} user
 */
function userInfo(user) {
    if (user.presence.status == 'online') user.presence.status = 'Online';
    else if (user.presence.status == 'dnd') user.presence.status = 'Do Not Disturb';
    else if (user.presence.status == 'idle') user.presence.status = 'AFK';
    else if (user.presence.status == 'offline') user.presence.status = 'Offline/Disconnected';
    if (user.presence.game == null) user.presence.game = {
        name: '*null*',
        streaming: false,
        type: 0,
        url: null
    };
    return new discord.RichEmbed()
        .setDescription(`${user.user.username} info`)
        .setColor([255, 0, 0])
        .addField('Full Username', user.user.tag, true)
        .addField('ID', user.id, true)
        .addField('Roles', '**Hoist:** ' + user.hoistRole + '\n**Highest:** ' + user.highestRole + '\n**Color:** ' + user.colorRole, true)
        .addField('Presence', '**Playing:** ' + user.presence.game.name + '\n**Streaming:** ' + user.presence.game.streaming + '\n**Status:** ' + user.presence.status, true)
        .addField('Created at', user.user.createdAt.toUTCString(), true)
        .addField('Joined at', user.joinedAt.toUTCString(), true)
        .addField('Bot', user.user.bot, true)
        .addField('Avatar', '**Avatar Hash:** ' + user.user.avatar + '\n**AvatarURL:** ' + user.user.displayAvatarURL, true)
        .setAuthor(user.user.username, user.user.displayAvatarURL)
        .setThumbnail(user.user.displayAvatarURL);
}



/************************************************
*                                               *
*                   COMMANDS                    *
*                                               *
************************************************/


client.on('message', (msg) => {
    var messageArray = msg.content.split(' ');
    var command = messageArray[0];
    var args = messageArray.slice(1).join(' ');
    if (msg.author.bot) return;
    if (msg.channel.type == 'dm' || msg.channel.type == 'group') return;
    if (!command.startsWith(prefix)) return;

    var helpCommand = require('./commands/help');
    new helpCommand(client, msg);
    
    //Voice

    new voiceCommands(msg, servers);

    //Support

    if (command == prefix + 'invite') {
        client.generateInvite(['ADMINISTRATOR']).then(link => {
            msg.channel.send(new discord.RichEmbed()
                .setTitle('Invite me to your server!')
                .setAuthor(client.user.username, client.user.displayAvatarURL)
                .setColor([255, 0, 0])
                .setDescription(link)
                .setURL(link));
        });
    } else if (command == prefix + 'info') {
        msg.channel.send(new discord.RichEmbed()
            .setAuthor(client.user.username, client.user.avatarURL)
            .setColor([255, 0, 0])
            .setThumbnail(client.user.avatarURL)
            .addField('Wikies', '[**Home**](' + wikis.home + ')\n[**Commands**](' + wikis.commands + ')\n[**Replies**](' + wikis.replies + ')\n[**FAQ**](' + wikis.faq + ')'));
    }

    //Info

    else if (command == prefix + 'server') {
        if (msg.guild.available) {
            if (msg.guild.verificationLevel == 0) {
                msg.guild.verificationLevel = 'None';
            }
            if (msg.guild.verificationLevel == 1) {
                msg.guild.verificationLevel = 'Low: Must have a verified e-mail on their Discord account';
            }
            if (msg.guild.verificationLevel == 2) {
                msg.guild.verificationLevel = 'Medium: Must have a verified e-mail and be registreder for longer than 5 minutes';
            }
            if (msg.guild.verificationLevel == 3) {
                msg.guild.verificationLevel = '(╯°□°）╯︵ ┻━┻: Must be in the server for longer than 10 minutes';
            }
            if (msg.guild.verificationLevel == 4) {
                msg.guild.verificationLevel = '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻: Must have a phone on their discord account';
            }

            if (msg.guild.afkChannel == null || msg.guild.afkChannelID == null) {
                var afkchannelname = "*null*"
                msg.guild.afkChannelID = "*null*"
                msg.guild.afkTimeout = "*null*"
            } else {
                var afkchannelname = msg.guild.afkChannel.name;
            }


            msg.channel.send(new discord.RichEmbed()
                .setAuthor(msg.guild.name, msg.guild.iconURL)
                .setColor([0, 0, 255])
                .setThumbnail(msg.guild.iconURL)
                .addField('ID', msg.guild.id, true)
                .addField('Region', msg.guild.region, true)
                .addField('AFK', '**Channel** ' + afkchannelname + '\n**ChannelID:** ' + msg.guild.afkChannelID + '\n**Timeout(seconds):** ' + msg.guild.afkTimeout, true)
                .addField('Counts', '**Members:** ' + msg.guild.memberCount + '\n**Roles:** ' + msg.guild.roles.size, true)
                .addField('Owner', '**Owner:** ' + msg.guild.owner + '\n**OwnerID:** ' + msg.guild.ownerID, true)
                .addField('Verification Level', msg.guild.verificationLevel, true)
                .addField('Icon', '**Icon Hash:** ' + msg.guild.icon + '\n**Icon URL:** ' + msg.guild.iconURL, true));
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .setDescription('Server not available'));
        }
    } else if (command == prefix + 'role') {
        if (msg.mentions.roles.first()) {
            var role = msg.mentions.roles.first();

            msg.channel.send(new discord.RichEmbed()
                .setColor([0, 0, 255])
                .addField('Name', role.name)
                .addField('ID', role.id)
                .addField('Hex Color', role.hexColor)
                .addField('Position', role.position + 1)
                .addField('Mentionable', role.mentionable)
                .addField('Managed by a Bot', role.managed)
                .addField('Hoisted', role.hoist)
                .addField('Member Count', role.members.size));
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .addField('Help', 'Check the [wiki](' + wikis.commands + '#info) for help!')
                .setDescription('Pleace specify a role!'));
        }
    }
    else if (command == prefix + 'channel') {
        if (msg.mentions.channels.first()) {
            var channel = msg.mentions.channels.first();
            msg.channel.send(new discord.RichEmbed()
                .setColor([0, 0, 255])
                .setTitle(channel.name)
                .addField('Name', channel.name)
                .addField('ID', channel.id)
                .addField('Calculated Position', channel.calculatedPosition + 1)
                .addField('Type', channel.type)
                .addField('Created At', channel.createdAt.toUTCString()));
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .addField('Help', 'Check the [wiki](' + wikis.commands + '#info) for help!')
                .setDescription('Pleace specify a channel!'));
        }
    } else if (command == prefix + 'user') {
        if (msg.mentions.members.first()) {
            var user = msg.mentions.members.first();
            msg.channel.send(userInfo(user));
        } else {
            var user = msg.member;
            msg.channel.send(userInfo(user));
        }
    } else if (command == prefix + 'avatar') {
        if (!msg.mentions.members.first()) {
            var user = msg.member.user;
            msg.channel.send(new discord.RichEmbed()
                .setImage(user.displayAvatarURL)
                .setColor([255, 0, 0])
                .setURL(user.displayAvatarURL)
                .setDescription(user.username + '\'s Avatar'));
        } else {
            var user = msg.mentions.members.first().user;
            msg.channel.send(new discord.RichEmbed()
                .setImage(user.displayAvatarURL)
                .setColor([255, 0, 0])
                .setURL(user.displayAvatarURL)
                .setDescription(user.username + '\'s Avatar'));
        }
    }

    //Random

    else if (command == prefix + 'roll') {
        const roll = Math.floor(Math.random() * 6) + 1;
        msg.channel.send(new discord.RichEmbed()
            .setColor([255, 0, 0])
            .setTitle('Roll')
            .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL)
            .setDescription('You Rolled a: **' + roll + '**'));
    } else if (command == prefix + 'rate') {
        const rate = Math.floor(Math.random() * 11);
        if (!args == '' || !args == null) {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .setTitle('Rate')
                .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL)
                .setDescription('I\'d rate ' + args + ' a: ' + rate));
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .addField('Help', 'Check the [wiki](' + wikis.commands + '#random) for help!')
                .setDescription('Pleace specify something to rate!'));
        }
    } else if (command == prefix + '8ball') {
        var response = [
            'Nope',
            'Yes',
            'Of Course',
            'Never',
            'Not looking so good...',
            'Concentrate and ask again',
            'Yes, definitely',
            'Better not tell you now'
        ];
        msg.channel.send(new discord.RichEmbed()
            .setColor([255, 0, 0])
            .setTitle('8ball')
            .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL)
            .setDescription(response[Math.floor(Math.random() * response.length)]));
    } else if (command == prefix + 'cat') {
        randomCat.getCat().then(cat => {
            msg.channel.send(new discord.RichEmbed()
                .setImage(cat.file)
                .setColor([255, 0, 0])
                .setTitle('Random Cat')
                .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL));
        });
    } else if (command == prefix + 'dog') {
        randomDog.getDog().then(dog => {
            msg.channel.send(new discord.RichEmbed()
                .setImage(dog.url)
                .setColor([255, 0, 0])
                .setTitle('Random Dog')
                .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL));
        });
    } else if (command == prefix + 'coinflip') {
        if (Math.random() < 0.5) {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .setAuthor(msg.member.user.username, msg.member.user.avatarURL)
                .setTitle('Coin flip!')
                .setDescription('I flipped a coin and it landed on **heads**.'));
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .setAuthor(msg.member.user.username, msg.member.user.avatarURL)
                .setTitle('Coin flip!')
                .setDescription('I flipped a coin and it landed on **tails**.'));
        }
    }

    //Moderation

    else if (command == prefix + 'kick') {
        if (msg.member.hasPermission(['KICK_MEMBERS']) || msg.member.hasPermission(['ADMINISTRATOR'])) {
            if (msg.mentions.members.first()) {
                if (msg.member.user.id == msg.mentions.members.first().id) {
                    msg.channel.send(new discord.RichEmbed()
                        .setColor([255, 0, 0])
                        .setDescription('Why do you want to kick yourself...?')
                        .setTitle('Are you serious?'));
                } else {
                    if (msg.mentions.members.first().kickable) {
                        msg.mentions.members.first().kick().then((member) => {
                            member.send(new discord.RichEmbed()
                                .setDescription('You got kicked from ' + msg.guild.name)
                                .setColor([255, 0, 0])
                                .setTitle('Kicked')
                                .addField('Kicked by', msg.member.user.tag));

                            msg.channel.send(new discord.RichEmbed()
                                .setColor([255, 0, 0])
                                .setTitle('Kicked')
                                .setDescription('Succesfully kicked: ' + member.user.tag));
                        });
                    } else {
                        msg.channel.send(new discord.RichEmbed()
                            .setColor([255, 0, 0])
                            .setTitle('Kick Error')
                            .setDescription('I cannot kick owner/admins/role higher than me'));
                    }
                }
            } else {
                msg.channel.send(new discord.RichEmbed()
                    .setColor([255, 0, 0])
                    .addField('Help', 'Check the [wiki](' + wikis.commands + '#moderation) for help!')
                    .setDescription('Pleace specify an user!'));

            }
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL)
                .setTitle('ERROR')
                .setDescription('You dont have permissions to run that command.')
                .setColor([255, 0, 0]));
        }
    } else if (command == prefix + 'ban') {
        if (msg.member.hasPermission(['BAN_MEMBERS']) || msg.member.hasPermission(['ADMINISTRATOR'])) {
            if (msg.mentions.members.first()) {
                if (msg.member.user.id == msg.mentions.members.first().id) {
                    msg.channel.send(new discord.RichEmbed()
                        .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL)
                        .setTitle('ERROR')
                        .setDescription('You dont have permissions to run that command.')
                        .setColor([255, 0, 0]));
                } else {
                    if (msg.mentions.members.first().bannable) {
                        msg.mentions.members.first().ban().then((member) => {
                            member.send(new discord.RichEmbed()
                                .setDescription('You got banned from ' + msg.guild.name)
                                .setColor([255, 0, 0])
                                .setTitle('Banned')
                                .addField('Banned by', msg.member.user.tag));

                            msg.channel.send(new discord.RichEmbed()
                                .setColor([255, 0, 0])
                                .setTitle('Banned')
                                .setDescription('Succesfully banned: ' + member.user.tag));
                        });
                    } else {
                        msg.channel.send(new discord.RichEmbed()
                            .setColor([255, 0, 0])
                            .setTitle('Ban Error')
                            .setDescription('I cannot ban owner/admins/role higher than me'));
                    }
                }
            } else {


            }
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL)
                .setTitle('ERROR')
                .setDescription('You dont have permissions to run that command.')
                .setColor([255, 0, 0]));
        }
    } else if (command == prefix + 'prune') {
        if (msg.member.hasPermission(['MANAGE_MESSAGES']) || msg.member.hasPermission(['ADMINISTRATOR'])) {
            if (!args == null || !args == "") {
                if (args == "1" || parseInt(args) > 99) {
                    msg.channel.send(new discord.RichEmbed()
                        .addField('Help', 'Check the [wiki](' + wikis.commands + '#moderation) for help!')
                        .setDescription('Pleace specify a number between 2 and 99!')
                        .setColor([255, 0, 0]));
                } else {
                    msg.channel.bulkDelete(parseInt(args)).then(() => {
                        msg.channel.send(new discord.RichEmbed()
                            .setColor([255, 0, 0])
                            .setDescription('Deleted ' + args + ' Messages.')).then(deletemsg => {
                                deletemsg.delete(5000);
                            });;
                    });
                }

            } else {
                msg.channel.send(new discord.RichEmbed()
                    .setColor([255, 0, 0])
                    .addField('Help', 'Check the [wiki](' + wikis.commands + '#moderation) for help!')
                    .setDescription('Please specify a number!'));
            }
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL)
                .setTitle('ERROR')
                .setDescription('You dont have permissions to run that command.')
                .setColor([255, 0, 0]));
        }
    }

    //Fun

    else if (command == prefix + 'say') {
        var thing2say = args;
        if (!thing2say == '' || thing2say == null) {
            msg.channel.send(new discord.RichEmbed()
                .setDescription(thing2say)
                .setColor([255, 0, 0])
                .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL));
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .addField('Help', 'Check the [wiki](' + wikis.commands + '#fun) for help!')
                .setDescription('Pleace specify something to say!'));
        }

    } else if (command == prefix + 'lenny') {
        msg.channel.send(new discord.RichEmbed()
            .setColor([255, 0, 0])
            .setTitle('Lenny')
            .setDescription('( ͡° ͜ʖ ͡°)'));
    } else if (command == prefix + 'cookie') {
        var images = [
            'https://pa1.narvii.com/5899/43e61495729fd10dda05c313545a57d43ebb1dee_hq.gif',
            'http://i.giphy.com/E77F8BfvntOq4.gif',
            'https://media1.tenor.com/images/9a684862dd6a95ca16c5ecd6b02b119f/tenor.gif?itemid=5446986',
            'http://i.imgur.com/bYVl2.gif'
        ];
        var cookieImg = images[Math.floor(Math.random() * images.length)];
        if (msg.mentions.members.first()) {
            msg.channel.send(new discord.RichEmbed()
                .setTitle(msg.member.user.username + ' Has given a cookie to ' + msg.mentions.members.first().user.username)
                .setColor([255, 0, 0])
                .setImage(cookieImg));
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .addField('Help', 'Check the [wiki](' + wikis.commands + '#fun) for help!')
                .setDescription('Pleace specify an user!'));
        }
    } else if (command == prefix + 'sandwich') {
        var images = [
            'https://pa1.narvii.com/6272/7beb194348fefb46bfdd519cb1ef0e530a621247_hq.gif',
            'https://i.imgur.com/325tm32.gif',
            'https://mayraissenpai.files.wordpress.com/2016/12/tumblr_m6krnt7ghk1qk46vzo1_500.gif?w=656',
            'https://78.media.tumblr.com/66405e70b83061ec312ba553eb577847/tumblr_n6k8kv9AK21r4kkpvo1_500.gif',
            'https://78.media.tumblr.com/c4ced24d4ffaba84b430a9faca23d206/tumblr_opnapuxv531vviqkjo1_500.gif',
            'https://i.pinimg.com/originals/c5/b6/94/c5b694dbce3e8662b01adb6771463aa1.gif'
        ];
        var sandwichImg = images[Math.floor(Math.random() * images.length)];
        if (msg.mentions.members.first()) {
            msg.channel.send(new discord.RichEmbed()
                .setTitle(msg.member.user.username + ' Has given a sandwich to ' + msg.mentions.members.first().user.username)
                .setColor([255, 0, 0])
                .setImage(sandwichImg));
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .addField('Help', 'Check the [wiki](' + wikis.commands + '#fun) for help!')
                .setDescription('Pleace specify an user!'));
        }
    } else if (command == prefix + 'pat') {
        var images = [
            'https://pa1.narvii.com/6490/e9649d41af555774b0bd62ed43c050dc036ed6c9_hq.gif',
            'http://i0.kym-cdn.com/photos/images/original/001/142/787/396.gif',
            'https://media.giphy.com/media/SvQ7tWn8zeY2k/source.gif',
            'https://78.media.tumblr.com/18e1fdcde34edf0cf03c588162fbd0ea/tumblr_npeccq4y3H1rzk6edo1_500.gif',
            'https://pa1.narvii.com/6353/60e5d2c9721de7f3f3b1946acfa3acc2f3d43b9e_hq.gif',
            'http://i.imgur.com/laEy6LU.gif',
            'https://funnypictures1.fjcdn.com/funny_gifs/Head_389b42_6102763.gif',
            'https://memestatic4.fjcdn.com/thumbnails/comments/She+deserves+all+the+head+pats+_952b94cc7a9bfd9107e28ece64b158de.gif'
        ];
        var patImg = images[Math.floor(Math.random() * images.length)];
        if (msg.mentions.members.first()) {
            msg.channel.send(new discord.RichEmbed()
                .setTitle(msg.member.user.username + ' Has given a headpat to ' + msg.mentions.members.first().user.username)
                .setColor([255, 0, 0])
                .setAuthor('>///<')
                .setImage(patImg));
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .addField('Help', 'Check the [wiki](' + wikis.commands + '#fun) for help!')
                .setDescription('Pleace specify an user!'));
        }

    } else if (command == prefix + 'reverse') {
        if (!args == '' || args == null) {
            var reversedText = reverseString(args);
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .setAuthor(msg.member.user.username, msg.member.user.displayAvatarURL)
                .setDescription(reversedText)
                .setTitle('Reverse'));
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .addField('Help', 'Check the [wiki](' + wikis.commands + '#fun) for help!')
                .setDescription('Pleace specify something to reverse!'));
        }
    }

    //Osu

    new osuCommands().commands(msg);

    //Misc

    if (command == prefix + 'ping') {
        msg.channel.send(new discord.RichEmbed()
            .setTitle('Pinging...')
            .setColor([0, 0, 255])).then(pingMsg => {
                pingMsg.edit(new discord.RichEmbed()
                    .setColor([255, 0, 0])
                    .setTitle('Pong!')
                    .addField('Bot', `**${pingMsg.createdTimestamp - msg.createdTimestamp}ms.**`, true)
                    .addField('API', `**${client.ping}ms.**`, true));
            });
    } else if (command == prefix + 'pong') {
        msg.channel.send(new discord.RichEmbed()
            .setTitle('Pinging...')
            .setColor([0, 0, 255])).then(pingMsg => {
                pingMsg.edit(new discord.RichEmbed()
                    .setColor([255, 0, 0])
                    .setTitle('Ping!')
                    .addField('Bot', `**${pingMsg.createdTimestamp - msg.createdTimestamp}ms.**`, true)
                    .addField('API', `**${client.ping}ms.**`, true));
            });
    } else if (command == prefix + 'uptime') {
        var miliseconds = client.uptime % 999;
        var seconds = Math.floor(client.uptime / 1000) % 59;
        var minutes = Math.floor(Math.floor(client.uptime / 1000) / 60) % 59;
        var hours = Math.floor(Math.floor(Math.floor(client.uptime / 1000) / 60) / 60) % 23;
        var days = Math.floor(Math.floor(Math.floor(Math.floor(client.uptime / 1000) / 60) / 60) / 24);
        msg.channel.send(new discord.RichEmbed()
            .setColor([255, 0, 0])
            .setAuthor(client.user.username, client.user.avatarURL)
            .addField('Days', days)
            .addField('Hours', hours)
            .addField('Minutes', minutes)
            .addField('Seconds', seconds)
            .addField('Miliseconds', miliseconds));
    } else if (command == prefix + 'wiki') {
        if (wikis.isEnabled) {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .setAuthor(client.user.username, client.user.avatarURL)
                .addField('Wikis', '**Home:** ' + wikis.home + '\n**Commands:** ' + wikis.commands + '\n**Replies:** ' + wikis.replies + '\n**FAQ:** ' + wikis.faq)
                .setFooter('Wikis hosted by Github'));
        }
    }

    //Bot Owner

    else if (command == prefix + 'disconnect') {
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
    } else if (command == prefix + 'eval') {

        if (msg.member.user.id == owner.id) {
            try {
                const code = args;
                var evaled = eval(code);
                evaled = clean(evaled);
                if (typeof evaled !== 'string')
                    evaled = require('util').inspect(evaled);
                msg.channel.send(new discord.RichEmbed()
                    .setColor([255, 0, 0])
                    .setTitle('Eval Command')
                    .addField('Input', `\`\`\`${code}\`\`\``)
                    .addField('Output:', `\`\`\`xl\n${clean(evaled)}\`\`\``));
            } catch (err) {
                msg.channel.send(new discord.RichEmbed()
                    .setTitle('ERROR')
                    .setColor([255, 0, 0])
                    .setDescription('\`\`\`xl\n' + clean(err) + '\`\`\`'));
            }
        } else {
            msg.channel.send(new discord.RichEmbed()
                .setColor([255, 0, 0])
                .setDescription('Bot owner only!')
                .setFooter('how did you found this command?')
            );
        }
    }
})

    /************************************************
    *                                               *
    *                   REPLIES                     *
    *                                               *
    ************************************************/

client.on('message', (msg) => {
        if (msg.author.bot) return;
        if (msg.channel.type == 'dm' || msg.channel.type == 'group') return;

        var message = msg.content.toLowerCase();

        if (message == 'ayy')
            msg.channel.send('lmao');
        if (message == 'omaewa mou shindeiru' || message == 'omae wa mou shindeiru')
            msg.channel.send('NANI!?!');
        if (message == 'おまえ わ もう しんでいる')
            msg.channel.send('なに！？');
        if (message == 'o/')
            msg.channel.send('\\o');
        if (message == '\\o')
            msg.channel.send('o/');
        if (message == 'top')
            msg.channel.send('kek');
        if (message == 'ok' || message == 'oke')
            msg.channel.send('oke');
        if (message == 'lmao')
            msg.channel.send('ayy');
        if (message == 'sauce')
            msg.channel.send('no ketchup');
    });

    new osuCommands().replies(client);

client.login(token).catch(e => console.log(e));
