var express     = require('express');
var connect     = require('connect');
var util        = require('util');
var fs          = require('fs');
var config      = require('./cfg/config');
exports         = module.exports;

exports.boot = function () {
    var app = express.createServer();

    // Load environment configs.
    require('./cfg/env')(app, express);

    // Load routes and controllers.
    require('./cfg/routes')(app, express);

    // Load utilities.
    require('./lib/util');

    // Load models.
    if (config.config.useModels) {
        var mongoose = require('mongoose');
        mongoose.connect('mongodb://localhost:27017/app');

        fs.readdir(config.dir.models, function (err, files) {
            console.log(err);
            console.log(files);
            process.exit();
            files.forEach(function (file) {
                fs.stat(config.dir.models + file, function (err, stats) {
                    if (stats.isFile()) {
                        require(config.dir.models + file);
                    }
                });
            });
        });
    }

    // Setup static helpers
    app.helpers({
        config: config.config
    });

    // Setup dynamicHelpers
    app.dynamicHelpers({
        session: function (req, res) {
            return req.session;
        },
        head: function () {
            var css = [];
            var scripts = [];

            return {
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
            };
        }
    });

    return app;
};

exports.setConfig = function(cfg) {
    config.setConfig(cfg);
    return exports;
}

for (var key in connect.middleware) {
      Object.defineProperty(exports, key, Object.getOwnPropertyDescriptor(connect.middleware, key));
}
