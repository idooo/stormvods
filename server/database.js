var mongoose = require('mongoose');

var modelsFiles = ['datasource'];

module.exports = function(config) {

    config.database.isConnected = false;

    var options = {
        db: { native_parser: true },
        server: { poolSize: 5 },
        user: config.database.username,
        pass: config.database.password
    };
    var models = [];

    mongoose.connect(config.database.uri + ':' + config.database.port + '/' + config.database.db, options);

    var connection = mongoose.connection;
    connection.on('error', function(err) {
        config.logger.error("Database connection error", JSON.stringify(err));
    });
    connection.once('open', function callback () {
        config.database.isConnected = true;
        config.logger.info('DB connected ' + config.database.uri + '/' + config.database.db);
    });

    modelsFiles.forEach(function(modelName) {
        var tmp = require('./models/' + modelName)(mongoose, config, models);
        models[tmp.name] = tmp.model;
    });

    //
    //
    //// Warning!
    //// database.clean option is using for testing
    //// all the collection will be dropped on the start if this flag was specified
    //if (config.database.clean) {
    //    config.logger.warn('database.clean flag was specified, all the DB collections will be removed');
    //    Object.keys(models).forEach(function(modelName) {
    //        models[modelName].remove({}, function(err) {
    //           config.logger.warn(modelName + ' collection was removed')
    //        });
    //    });
    //}

    return models;
};
