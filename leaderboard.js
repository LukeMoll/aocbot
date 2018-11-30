const fs = require('fs');
const request = require('request');
const express = require('express');
const formparser = require('body-parser').urlencoded({extended: true});

const router = express.Router();

const config = JSON.parse(fs.readFileSync("secrets.json"));

const cookieJar = request.jar();
cookieJar.setCookie(request.cookie(`session=${config.session_cookie}`), "http://adventofcode.com");
const year = 2017;
const leaderboardURL = `https://adventofcode.com/${year}/leaderboard/private/view/${config.private_leaderboard}.json`;

router.post('/', formparser, (req,res) => {
    let responseURL = req.body.response_url;
    // console.log('/aoc');
    
    getLeaderboard((lerr, lres, lbody) => {
        // console.log(' Got leaderboard');
        let options = {
            uri: responseURL,
            method: 'POST',
            json: {
                "author_name": "Advent of Code",
                "author_icon": "https://runciman.hacksoc.org/~ldm/img/aoc.png",
                "author_link": "https://adventofcode.com",
                "text": `*Advent of Code Leaderboard ${year}*\n` + formatLeaderboard(JSON.parse(lbody))
            }
        };
        // console.log(" " + options.json.text);
        // console.log(' Got options, sending response...');
        res.status(200).json(options.json);
        // request(options, (rerr, rres, rbody) => {
        //     if(rerr) {
        //         console.log(rerr);
        //     }
        //     console.log(' Response sent');
        // });
    });

    // res.status(200).send();
    // console.log(' 200 sent');
});

router.get('/', (req,res) => {
    getLeaderboard((lerr, lres, lbody) => {
        res.send(lbody);
    });
})

function getLeaderboard(callback) {
    request({
        url: leaderboardURL,
        jar: cookieJar
    }, callback);
}

function formatLeaderboard(leaderboard) {
    let members = Object.values(leaderboard.members);
    return members
        // .sort(multiFactorPredicate("local_score", "stars", "global_score"))
        .filter(m=>m.local_score > 0)
        .sort(sortByLocalScore)
        .map((m,i,a) => {
            return `${i+1}) ${m.stars}⨉:star: [${m.local_score}] *${m.name}*` 
                   // + m.global_score > 0? ` (global score: ${m.global_score}`:'';
        }).join('\n');
}

function sortByLocalScore(a,b) {
    if(a.local_score == b.local_score) {
        return 0;
    }
    else {
        return a.local_score > b.local_score ? -1 : 1;
    }
}

function multiFactorPredicate(...keys) {
    keys = keys.reverse();
    return (a,b) => {
        let k = keys.pop();
        while(k !== undefined) {
            if(a[k] === b[k]) { // this factor identical
                continue;
            }
            else {
                return a[k] > b[k] ? -1 : 1;
            }
        }
        return 0; // run out of factors
    }
}

module.exports = {router, getLeaderboard, formatLeaderboard, year};
const ircbot = require('./ircbot');
ircbot.start(module.exports);