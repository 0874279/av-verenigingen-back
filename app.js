var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var db = mongoose.connect('mongodb://localhost/clubapi', {useMongoClient: true});
var Club = require('./models/clubModel');
var app = express();
var port = process.env.PORT;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// headers
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods' , 'POST, GET, PUT, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    res.header('Accept', 'application/json');

    if (!req.accepts('application/json')) {
        return res.status(415).send({ "error": "Unsupported format" });
    }

    next();
});

clubRouter = require('./Routes/clubRoutes')(Club);

app.use('/api/clubs', clubRouter);


app.get('/', function(req, res){
    res.send('AV-verenigingen API')
});

app.listen(port, function(){
    console.log('running on PORT: ' + port)
});