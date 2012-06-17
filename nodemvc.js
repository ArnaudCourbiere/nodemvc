var express     = require('express');
var mongoose    = require('mongoose');
var connect     = require('connect');
var util        = require('util');
var fs          = require('fs');
var _           = require('underscore');
exports         = module.exports;
var config;

exports.boot = function (configPath) {
    var app = express.createServer();

    // Load environment configs.
    require('./cfg/env')(app, express);

    // Load routes and controllers.
    require('./cfg/routes')(app, express);

    // Load utilities.
    require('./lib/util');

    // Load models.
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

    // TODO add static helper and pass config.

    // Setup dynamicHelpers
    app.dynamicHelpers({
        session: function (req, res) {
            return req.session;
        },
        menu: function (req, res) {
            
            // TODO: query from db.
            var menu = {
                home: {
                    label: "Home",
                    title: "Homepage",
                    href: "/",
                    class: ''
                },
                blog: {
                    label: "Blog",
                    title: "The Blog",
                    href: "/blog",
                    class: ''
                },
                about: {
                    label: "About",
                    title: "About this site",
                    href: "/about",
                    class: ''
                }
            }

            var navPage = req.params[0].split('/')[0];
            
            if (navPage == '') {
                navPage = 'home';
            }

            if (menu[navPage]) {
                menu[navPage].class += ' active';
            }

            return menu;
        }
    });

    return app;
};

for (var key in connect.middleware) {
      Object.defineProperty(exports, key, Object.getOwnPropertyDescriptor(connect.middleware, key));
}
