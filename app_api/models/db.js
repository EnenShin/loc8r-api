const mongoose = require('mongoose');
// var dbURI = 'mongodb://localhost/Loc8r';
var dbURI = 'mongodb+srv://myatlasdbuser:1q2w3e4r!@cluster0.g20c8.mongodb.net/Loc8r';
mongoose.connect(dbURI, {useNewUrlParser: true});

mongoose.connection.on('connected',function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);   
});
mongoose.connection.on('disconnected',function () {
    console.log('Mongoose disconnected');
})

var gracefulShutdown = function (msg, callback){
    mongoose.connection.close(function (){
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

mongoose.connection.on('SIGUSR2',function () {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
mongoose.connection.on('SIGINT',function () {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});
mongoose.connection.on('SIGTERM',function () {
    gracefulShutdown('Heroku app shutdown', function() {
        process.exit(0);
    });
});

require('./locations')