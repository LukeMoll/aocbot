const request = require('request');
const express = require('express');
const formparser = require('body-parser').urlencoded({extended: true});

const router = express.Router();

router.post('/', formparser, (req,res) => {
    let responseURL = req.body.response_url;
    let options = {
        uri: responseURL,
        method: 'POST',
        json: {
            "text": "Wololo" // todo put the stuff in here
        }
    };
    request(options, (rerr, rres, rbody) => {
        if(rerr) {
            console.log(rerr);
        }
    });
});

module.exports = router;