const mongoose= require('mongoose');

// DB connection estabilished

mongoose.connect('mongodb://127.0.0.1/Tweets');
const db= mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function callback() {
    console.log('connection estabilished');
});
exports.db=db;