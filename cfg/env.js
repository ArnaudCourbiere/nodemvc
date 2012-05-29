/**
 * TODO
 */

var fs      = require('fs');
var util    = require('util');

try {
    var config              = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
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
            app.use(express.logger());
            app.use(express.static(__dirname + '/../public'));
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
} catch (error) {
    util.log(util.inspect(error));
    util.log('File config.json not found. Try `cp config.default.json config.json`');
}
