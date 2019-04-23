const config = require("./config"),
    mongoose = require('mongoose');

module.exports = function(){
    return new Promise(function(resolve, reject){
        mongoose.Promise = global.Promise;
        mongoose.set('debug', true);

        mongoose.connection
            .on('error', error => reject(error))
            .on('close', function(){
                console.log('Database connection closed.')
            })
            .once('open', function(){
                resolve(mongoose.connection[0])
            })
        
        mongoose.connect(config.MONGO_URL, {useMongoClient: true})
    });
};