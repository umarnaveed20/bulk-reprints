var express = require('express');

var app = express();

app.get('/', function (req, res) {
    res.send('Welcome to Bulk Reprints API Store')
});

require('./routes/bulkReprintsRoutes')(app);

app.listen(5000, function () {
    console.log('Server is running..');
});