const IRC = require('irc-framework');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync("secrets.json"));
const bot = new IRC.Client();
const leaderboard = require('./leaderboard');

module.exports = {
    start: function() {
        bot.connect({
            host: config.irc_server,
            port: 6667,
            nick: config.irc_nick
        });

        bot.on('registered', () => {
            console.log(`[irc] registered.`);
            bot.say('NICKSERV', `REGISTER ${config.irc_password}`);
            console.log(`[irc] messaged NICKSERV`);
            for(let channel of config.irc_channels) {
                bot.join(channel);
                console.log(`[irc] joined ${channel}`);
            }
        })

        bot.match(/^!aoc/, (event) => {
            event.reply(`Advent of Code Leaderboard ${leaderboard.year}`);
            leaderboard.getLeaderboard((lerr, lres, lbody) => {
                if(lerr) {
                    event.reply("Error getting leaderboard: " + lerr);
                }
                else {
                    let i = 0;
                    for(let line of leaderboard.formatLeaderboard(JSON.parse(lbody)).split('\n')) {
                        line = line.replace(/\*/g, "").replace(":star:", "*");
                        event.reply(line);
                        if(++i>=10) break;
                    }
                }
            })
        })
    }
}