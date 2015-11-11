/* global __dirname */

var restify = require('restify');

var server = restify.createServer();

server.get('/hello/:name', function (req, res, next) {
    res.send('hello ' + req.params.name);
    next();
});


server.get(/\/?.*/, restify.serveStatic({
    directory: __dirname + '/../web',
    default: 'index.html',
    maxAge: 1 // TODO: disable in production
}));


console.log(__dirname + '/../web/dist');


// Start server
server.listen(8080, function () {
    console.log('Server is listening at %s', server.url);
});