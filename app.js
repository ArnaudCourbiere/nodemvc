var express     = require('express');
var mongoose    = require('mongoose');
var util        = require('util');
var fs          = require('fs');
var _           = require('underscore');
var config      = require('./cfg/config');
var app         = module.exports = express.createServer();

try {

    // Load environment configs.
    require('./cfg/env')(app, express);

    // Load routes and controllers.
    require('./cfg/routes')(app, express);

    // Load utilities.
    require('./lib/util');
    
    // Load models.
    mongoose.connect('mongodb://localhost:27017/app');
    
    fs.readdir(config.dir.app + 'models/', function (err, files) {
        files.forEach(function (file) {
            fs.stat(config.dir.app + 'models/' + file, function (err, stats) {
                if (stats.isFile()) {
                    require(config.dir.app + 'models/' + file);
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

    if (!module.parent) {
        app.listen(3000);
        console.log('Express server started on port %s', app.address().port);
    }
} catch (error) {
    util.log(error);
}
