//#region Require Modules
//#region Discord Module
const discord = require('discord.js');
const { Client } = discord;
//#endregion
//#endregion

//#region Events
class Events {
    /**
     * Returns all the client events
     * @param {Client} client 
     */
    constructor(client) {
        //#region Data
        var main = new (require('../')).Main();
        this.data = main.getData();
        this.prefix = this.data.prefix();
        this.debug = this.data.debug();
        this.allEvents = this.data.allEvents();
        //#endregion
        //#region Discord Client settings
        this.client = client;
        //#endregion
    }
    ready() {
        if (this.data.disconnect() == true || this.data.disconnect() == 'true') {
            process.exit();
            return;
        } else {
            this.client.on('ready', () => {
                var me = this.client.user;
                this.client.setInterval((e) => {
                    switch (this.data.maintance()) {
                        case true:
                        case 'true':
                            me.setPresence({
                                status: 'dnd',
                                afk: false,
                                game: {
                                    name: this.prefix + 'help | ' + this.prefix + 'invite | ' + this.client.guilds.array().length + ' Servers'
                                }
                            });
                            break;
                        case false:
                        case 'false':
                            me.setPresence({
                                status: 'online',
                                afk: false,
                                game: {
                                    name: this.prefix + 'help | ' + this.prefix + 'invite | ' + this.client.guilds.array().length + ' Servers',
                                    url: 'https://www.twitch.tv/extremeexploit_'
                                }
                            });
                            break;
                        default:
                            me.setPresence({
                                afk: false,
                                status: 'idle',
                                game: {
                                    name: this.prefix + 'help | ' + this.prefix + 'invite | ' + this.client.guilds.array().length + ' Servers',
                                }
                            });
                            console.warn('ERROR: Bot status shouldn\'t be \`idle\`. Maintance mode should be boolean or string');
                            break;
                    }
                }, 30000);
                console.log('============================================');
                console.log('JavaScript Node.JS discord.js ' + discord.version);
                console.log('Username: ' + me.tag);
                console.log('ID: ' + me.id);
                console.log('Verified: ' + me.verified);
                console.log('Bot: ' + me.bot);
                console.log('Status: ' + me.presence.status);
                console.log('============================================');
                console.log('Prefix: ' + this.prefix);
                console.log('Debug Mode: ' + this.debug);
                console.log('All Events: ' + this.allEvents);
                console.log('Maintance Mode: ' + this.data.maintance());
                console.log('DiscordBots: ' + this.data.discordBots().enabled);
                console.log('============================================');
                console.log('Support: ' + this.data.commands().categories.Support);
                console.log('Info: ' + this.data.commands().categories.Info);
                console.log('Random: ' + this.data.commands().categories.Random);
                console.log('Moderation: ' + this.data.commands().categories.Moderation);
                console.log('Fun: ' + this.data.commands().categories.Fun);
                console.log('Osu: ' + this.data.commands().categories.Osu);
                console.log('Misc: ' + this.data.commands().categories.Misc);
                console.log('Wiki: ' + this.data.commands().categories.Wiki);
                console.log('Voting: ' + this.data.commands().categories.Voting);
                console.log('Bot Owner: ' + this.data.commands().categories.BotOwner);
                console.log('Replies Standard: ' + this.data.replies().standard);
                console.log('Replies Osu: ' + this.data.replies().osu);
                console.log('=============================================');
                console.log('Owner Username: ' + this.data.owner().username);
                console.log('Owner Discriminator: ' + this.data.owner().discriminator);
                console.log('Owner Id: ' + this.data.owner().id);
                console.log('Owner Tag: ' + this.data.owner().tag);
                console.log('=============================================');
                console.log('Servers: ' + this.client.guilds.array().length);
                console.log('============================================\n');
                console.log(`Connected. \n`);
                console.log('============================================\n');
            });
        }
    }
    disconnect() {
        this.client.on('disconnect', () => console.log('[ ' + new Date + ' ] [DISCONNECTED]'));
    }
    reconnecting() {
        this.client.on('reconnecting', () => console.log('[ ' + new Date + ' ] [RECONNECTING...]'));
    }
    warn() {
        this.client.on('warn', info => {
            console.log('====================WARN====================');
            console.warn(info);
            console.log('============================================');
        });
    }
    channelCreate() {
        this.client.on('channelCreate', ch => console.log('[ ' + new Date() + ' ] [CHANNEL_CREATE]'));
    }
    channelDelete() {
        this.client.on('channelDelete', ch => console.log('[ ' + new Date() + ' ] [CHANNEL_DELETE]'));
    }
    channelPinsUpdate() {
        this.client.on('channelPinsUpdate', ch => console.log('[ ' + new Date() + ' ] [CHANNEL_PINS_UPDATE]'));
    }
    channelUpdate() {
        this.client.on('channelUpdate', ch => console.log('[ ' + new Date() + ' ] [CHANNEL_UPDATE]'));
    }
    clientUserGuildSettingsUpdate() {
        this.client.on('clientUserGuildSettingsUpdate', e => console.log('[ ' + new Date() + ' ] [CLIENT_USER_GUILD_SETTINGS_UPDATE]'));
    }
    clientUserSettingsUpdate() {
        this.client.on('clientUserSettingsUpdate', e => console.log('[ ' + new Date() + ' ] [CLIENT_USER_SETTINGS_UPDATE]'));
    }
    emojiCreate() {
        this.client.on('emojiCreate', e => console.log('[ ' + new Date() + ' ] [EMOJI_CREATE]'));
    }
    emojiDelete() {
        this.client.on('emojiDelete', e => console.log('[ ' + new Date() + ' ] [EMOJI_DELETE]'));
    }
    emojiUpdate() {
        this.client.on('emojiUpdate', e => console.log('[ ' + new Date() + ' ] [EMOJI_UPDATE]'));
    }
    guildBanAdd() {
        this.client.on('guildBanAdd', e => console.log('[ ' + new Date() + ' ] [GUILD_BAN_ADD]'));
    }
    guildBanRemove() {
        this.client.on('guildBanRemove', e => console.log('[ ' + new Date() + ' ] [GUILD_BAN_REMOVE]'));
    }
    guildCreate() {
        this.client.on('guildCreate', e => console.log('[ ' + new Date() + ' ] [GUILD_CREATE]'));
    }
    guildMemberAdd() {
        this.client.on('guildMemberAdd', e => console.log('[ ' + new Date() + ' ] [GUILD_MEMBER_ADD]'));
    }
    guildMemberAvailable() {
        this.client.on('guildMemberAvailable', e => console.log('[ ' + new Date() + ' ] [GUILD_MEMBER_AVAILABLE]'));
    }
    guildMemberRemove() {
        this.client.on('guildMemberRemove', e => console.log('[ ' + new Date() + ' ] [GUILD_MEMBER_REMOVE]'));
    }
    guildMembersChunk() {
        this.client.on('guildMembersChunk', e => console.log('[ ' + new Date() + ' ] [GUILD_MEMBER_CHUNK]'));
    }
    guildMemberSpeaking() {
        this.client.on('guildMemberSpeaking', e => console.log('[ ' + new Date() + ' ] [GUILD_MEMBER_SPEAKING]'));
    }
    guildMemberUpdate() {
        this.client.on('guildMemberUpdate', e => console.log('[ ' + new Date() + ' ] [GUILD_MEMBER_UPDATE]'));
    }
    guildUnavailable() {
        this.client.on('guildUnavailable', e => console.log('[ ' + new Date() + ' ] [GUILD_UNAVAILABLE]'));
    }
    guildUpdate() {
        this.client.on('guildUpdate', e => console.log('[ ' + new Date() + ' ] [GUILD_UPDATE]'));
    }
    messageDelete() {
        this.client.on('messageDelete', e => console.log('[ ' + new Date() + ' ] [MESSAGE_DELETE]'));
    }
    messageDeleteBulk() {
        this.client.on('messageDeleteBulk', e => console.log('[ ' + new Date() + ' ] [MESSAGE_DELETE_BULK]'));
    }
    messageReactionAdd() {
        this.client.on('messageReactionAdd', e => console.log('[ ' + new Date() + ' ] [MESSAGE_REACTION_ADD]'));
    }
    messageReactionRemove() {
        this.client.on('messageReactionRemove', e => console.log('[ ' + new Date() + ' ] [MESSAGE_REACTION_REMOVE]'));
    }
    messageReactionRemoveAll() {
        this.client.on('messageReactionRemoveAll', e => console.log('[ ' + new Date() + ' ] [MESSAGE_REACTION_REMOVE_ALL]'));
    }
    messageUpdate() {
        this.client.on('messageUpdate', e => console.log('[ ' + new Date() + ' ] [MESSAGE_UPDATE]'));
    }
    presenceUpdate() {
        this.client.on('presenceUpdate', e => console.log('[ ' + new Date() + ' ] [PRESENCE_UPDATE]'));
    }
    resume() {
        this.client.on('resume', e => console.log('[ ' + new Date() + ' ] [RESUME]'));
    }
    roleCreate() {
        this.client.on('roleCreate', e => console.log('[ ' + new Date() + ' ] [ROLE_CREATE]'));
    }
    roleDelete() {
        this.client.on('roleDelete', e => console.log('[ ' + new Date() + ' ] [ROLE_DELETE]'));
    }
    roleUpdate() {
        this.client.on('roleUpdate', e => console.log('[ ' + new Date() + ' ] [ROLE_UPDATE]'));
    }
    typingStart() {
        this.client.on('typingStart', e => console.log('[ ' + new Date() + ' ] [TYPING_START]'));
    }
    typingStop() {
        this.client.on('typingStop', e => console.log('[ ' + new Date() + ' ] [TYPING_STOP]'));
    }
    userNoteUpdate() {
        this.client.on('userNoteUpdate', e => console.log('[ ' + new Date() + ' ] [USER_NOTE_UPDATE]'));
    }
    userUpdate() {
        this.client.on('userUpdate', e => console.log('[ ' + new Date() + ' ] [USER_UPDATE]'));
    }
    voiceStateUpdate() {
        this.client.on('voiceStateUpdate', e => console.log('[ ' + new Date() + ' ] [VOICE_STATE_UPDATE]'));
    }

    all() {
        this.ready();
        this.disconnect();
        this.reconnecting();
        this.warn();
        this.error();
        if (this.allEvents == true) {
            this.channelCreate();
            this.channelDelete();
            this.channelPinsUpdate();
            this.channelUpdate();
            this.clientUserGuildSettingsUpdate();
            this.clientUserSettingsUpdate();
            this.emojiCreate();
            this.emojiDelete();
            this.emojiUpdate();
            this.guildBanAdd();
            this.guildBanRemove();
            this.guildCreate();
            this.guildDelete();
            this.guildMemberAdd();
            this.guildMemberAvailable();
            this.guildMemberRemove();
            this.guildMembersChunk();
            this.guildMemberSpeaking();
            this.guildMemberUpdate();
            this.guildUnavailable();
            this.guildUpdate();
            this.messageDelete();
            this.messageDeleteBulk();
            this.messageReactionAdd();
            this.messageReactionRemove();
            this.messageReactionRemoveAll();
            this.messageUpdate();
            this.presenceUpdate();
            this.resume();
            this.roleCreate();
            this.roleDelete();
            this.roleUpdate();
            this.typingStart();
            this.typingStop();
            this.userNoteUpdate();
            this.userUpdate();
            this.voiceStateUpdate();
        }
        if (this.debug == true) {
            this.debug();
        }
    }
    debug() {
        this.client.on('debug', e => console.log(e));
    }
    error() {
        this.client.on('error', error => {
            console.log('====================ERROR====================');
            console.log('Error Message: ' + error.message);
            console.log('Error Name:' + error.name);
            console.log('Error Stack: ' + error.stack);
            console.log('=============================================');
        });
    }
}
//#endregion

exports.Events = Events;
