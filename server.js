var express = require('express');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send('Welcome to Bulk Reprints API Store')
});

app.post('/add', function (req, res) {
    console.log(req.body);
    res.status(200).send('User Added Successfully!');
})

app.put('/update/:id', function (req, res) {
    console.log(req.params.id);
    console.log(req.body);
    res.status(200).send('User modified!');
})

app.delete('/remove/:id', function (req, res) {
    console.log(req.params.id);
    res.send('User deleted!')
})

require('./routes/bulkReprintsRoutes')(app);

app.listen(5000, function () {
    console.log('Server is running..');
});