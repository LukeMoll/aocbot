const express = require('express');
const leaderboard = require('./leaderboard');

let app = express();

app.use('/leaderboard', leaderboard.router);

app.listen(1225, 'localhost');