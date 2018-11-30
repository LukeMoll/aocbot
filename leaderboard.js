const fs = require('fs');
const request = require('request');
const express = require('express');
const formparser = require('body-parser').urlencoded({extended: true});

const router = express.Router();

const options = JSON.parse(fs.readFileSync("secrets.json"));

const cookieJar = request.jar();
cookieJar.setCookie(request.cookie(`session=${options.session_cookie}`), "http://adventofcode.com");
const leaderboardURL = `https://adventofcode.com/2017/leaderboard/private/view/${options.private_leaderboard}.json`;

router.post('/', formparser, (req,res) => {
    let responseURL = req.body.response_url;

    
    getLeaderboard((lerr, lres, lbody) => {
        let options = {
            uri: responseURL,
            method: 'POST',
            json: {
                "text": formatLeaderboard(JSON.parse(lbody))
            }
        };
        request(options, (rerr, rres, rbody) => {
            if(rerr) {
                console.log(rerr);
            }
        });
    });

    res.status(200).send();
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
    leaderboard.members
        .sort(multiFactorPredicate("local_score", "stars", "global_score"))
        .map((m,i,a) => {
            return `${i+1}) **${m.name}** ${m.stars}⨉:star: ${m.local_score}` 
                    + m.global_score > 0? ` (global score: ${m.global_score}`:'';
        }).join('\n');
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

module.exports = router;