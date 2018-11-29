const express = require('express');
const leaderboard = require('./leaderboard');

let app = express();

app.use('/leaderboard', leaderboard);

app.listen(1225, 'localhost');