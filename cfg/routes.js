/**
 * TODO
 */

var fs  = require('fs');
var _   = require('underscore');

/**
 * Creates application routes and bootstraps the application controlers.
 * 
 * @param app
 *      The express server.
 * @param express
 *      the express module.
* @return void
 */
module.exports = function (app, express) {
    
    // Handling REST requests.
    app.all('/rest/:resource/:id([0-9a-z]+)?', function (req, res) {
        app.use(express.bodyParser());
        
        var rest        = require('../controllers/rest')(req, res);
        var resource    = req.params.resource;
        var id          = req.params.id;
        var body        = req.body;
        
        // TODO: Implement.
        switch (req.method.toLowerCase()) {
            case 'get':
                rest.get(resource, id);
                break;
                        
            case 'post':
                rest.post(resource, body);
                break;
            
            case'put':
                rest.put(resource, id, body);
                break;
            
            case 'delete':
                rest.delete(resource, id);
                break;
            
            default:
                throw new Error('Invalid method `' + req.method.toLowerCase() + '`');
        }
        
    });

    app.get('/*', function (req, res, next) {
        var request     = req.params[0];
        var segments    = request.split('/');

        if (segments.length == 1) {
            controllerName = segments[0] == '' ? 'index' : segments[0];
        }

        var functionName    = segments.length > 1 ? segments[1] + 'Action' : 'indexAction';
        var controllerPath  = __dirname + '/../controllers/' + controllerName + '.js';

        fs.stat(controllerPath, function (err, stats) {
            if (stats && stats.isFile()) {
                // TODO: Load all controllers at once?
                var controller = require('../controllers/' + controllerName);

                if (_.isFunction(controller[functionName])) {
                    controller[functionName](req, res);
                    return;
                }
            }

            next();
        });
    });
};
