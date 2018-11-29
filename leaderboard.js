const request = require('request');
const express = require('express');
const jsonparser = require('body-parser').json();

const router = express.Router();

router.post('/', jsonparser, (req,res) => {
    let responseURL = req.body.response_url;
    request(responseURL, {
        method: 'POST',
        json: {
            "text": "Wololo"
        }
    }, (err, res, body) => {
        if(err) {
            console.log(err);
        }
    })
});

module.exports = router;