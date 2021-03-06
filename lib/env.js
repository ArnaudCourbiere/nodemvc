/**
 * TODO
 */

var fs      = require('fs');
var util    = require('util');
var config  = require('./config').config;

process.env.NODE_ENV    = (config.env) ? config.env: 'prod';

/**
 * Sets up the application environment.
 * 
 * @param app
 *      The express server.
 * @param express
 *      the express module.
 * @return void
 */
module.exports = function (app, express) {
    
    // For every environment.
    app.configure(function () {
        app.set('views', config.paths.views);
        app.set('view engine', config.views.engine);
        app.use(express.logger());
    });
    
    app.configure('dev', function () {
        app.use(express.errorHandler({
            dumpExceptions  : true,
            showStack       : true
        }));
    });
    
    app.configure('prod', function () {
        app.use(express.errorHandler());
    });
};
