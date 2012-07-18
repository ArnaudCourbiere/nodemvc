var express     = require('express');
var connect     = require('connect');
var url         = require('url');
var util        = require('util');
var fs          = require('fs');
var config      = require('./config');
var _helpers     = {};

// expose createServer() as the module

exports = module.exports = createServer;

function createServer() {
    var app = express();

    app.use(express.favicon(config.config.paths.images + 'favicon.ico'));
    app.use(express.static(config.config.paths.public));

    // Setup helpers.
    app.use(function (req, res, next) {
        var css             = [];
        var scripts         = [];
        res.locals.config   = config.config;
        res.locals.session  = req.session;

        // Add segments array to req object
        var path        = url.parse(req.url).pathname;
        var segments    = path.split('/');

        segments.shift();

        res.locals.segments = segments;

        console.log(segments);

        // Apply all user defined helpers first.
        for (var helperName in _helpers) {
            if (typeof _helpers[helperName] == 'function') {
                res.locals[helperName] = _helpers[helperName](req, res);
            } else {
                res.locals[helperName] = _helpers[helperName];
            }
        }

        // Apply default helpers.
        res.locals.head = {
            css: {
                append: function (path) {
                    css.push(path);
                },
                prepend: function (path) {
                    css.unshift(path);
                },
                render: function () {
                    var returnVal = '';

                    for (index in css) {
                        returnVal += '<link rel="stylesheet" href="' + css[index] + '" media="all"/>';
                    }

                    return returnVal;
                }
            },
            script: {
                append: function (type, path) {
                    if (arguments.length == 1) {
                        path = type;
                        type = 'text/javascript';
                    }

                    scripts.push({
                        type: type,
                        path: path
                    });
                },
                prepend: function (type, path) {
                    if (arguments.length == 1) {
                        path = type;
                        type = 'text/javascript';
                    }

                    scripts.unshift({
                        type: type,
                        path: path
                    });
                },
                render: function () {
                    var returnVal = '';

                    for (index in scripts) {
                        returnVal += '<script type="' + scripts[index].type + '" src="' + scripts[index].path + '"></script>';
                    }

                    return returnVal;
                }
            }
        }

        next();
    });

    // Load environment configs.
    require('./env')(app, express);

    // Load routes and controllers.
     require('./routes')(app, express);

    // Load utilities.
    require('./util');

    // Load models.
    if (config.config.useModels) {
        var mongoose = require('mongoose');
        mongoose.connect('mongodb://localhost:27017/app');

        fs.readdir(config.dir.models, function (err, files) {
            files.forEach(function (file) {
                fs.stat(config.dir.models + file, function (err, stats) {
                    if (stats.isFile()) {
                        require(config.dir.models + file);
                    }
                });
            });
        });
    }

    return app;
};

exports.helpers = function(helpers) {
    _helpers = helpers;
};

exports.setConfig = function(cfg) {
    config.setConfig(cfg);
    return exports;
};

for (var key in connect.middleware) {
      Object.defineProperty(exports, key, Object.getOwnPropertyDescriptor(connect.middleware, key));
}
