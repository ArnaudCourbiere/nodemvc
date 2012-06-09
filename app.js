var express     = require('express');
var mongoose    = require('mongoose');
var util        = require('util');
var fs          = require('fs');
var app         = module.exports = express.createServer();

try {
    require('./cfg/env')(app, express);
    require('./cfg/routes')(app, express);
    require('./lib/util');
    
    mongoose.connect('mongodb://localhost:27017/app');
    
    // Load every models.
    fs.readdir('./models', function (err, files) {
        files.forEach(function (file) {
            fs.stat('./models/' + file, function (err, stats) {
                if (stats.isFile()) {
                    require('./models/' + file);
                }
            });
        });
    });

    // TODO add static helper and pass config.

    // Add dynamicHelpers
    app.dynamicHelpers({
        session: function (req, res) {
            return req.session;
        },
        menu: function (req, res) {
            
            // TODO: query db.
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

            var navPage = req.params.slice(0);
            
            if (navPage == '') {
                navPage = 'home';
            }

            menu[navPage].class += ' active';

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
