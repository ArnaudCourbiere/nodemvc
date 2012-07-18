/**
 * TODO
 */

var fs      = require('fs');
var config  = require('./config').config;

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
        
        var rest        = require(config.paths.controllers + 'rest')(req, res);
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

    // Match route with controller.
    app.all('/*', function (req, res, next) {
        var segments        = req.params[0].split('/');
        var controllerName  = segments[0] == '' ? 'index' : segments[0];
        var functionName    = (segments.length > 1 && segments[1] != '') ? segments[1] + 'Action' : 'indexAction';
        var controllerPath  = config.paths.controllers + controllerName + '.js';

        fs.stat(controllerPath, function (err, stats) {
            if (stats && stats.isFile()) {
                var controller = require(config.paths.controllers + controllerName);

                if (typeof controller == 'function') {
                    controller = controller();
                }

                if (typeof controller[functionName] == 'function') {
                    try {
                        if (typeof controller.init == 'function') {
                            var result = controller.init(req, res);

                            if (result == false) {
                                app.notFound(req, res);
                            }
                        }

                        var viewParams = controller[functionName](req, res);
                        res.render(controllerName, viewParams, function (err, result) {
                            if (err) {
                                throw err;
                            }

                            viewParams      = viewParams || {};
                            viewParams.body = result;

                            res.render('layout', viewParams);
                        });
                        return;
                    } catch (err) {
                        next(err);
                        return;
                    }
                }
            }

            next();
        });
    });


    // If error message has not found, assume 404.
    app.use(function (err, req, res, next) {
        console.log(err);
        if (~err.message.indexOf('not found')) {
            return next();
        }

        app.error(req, res);
    });

    // Assume 404 since no middleware responded.
    app.use(function (req, res, next) {
        app.notFound(req, res);
    });

    // App methods.
    app.error = function (req, res) {
        res.status(500).render('500');
    };

    app.notFound = function (req, res) {
        res.status(404).render('404', { url: req.originalUrl });
    }

};
