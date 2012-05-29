var express     = require('express');
var mongoose    = require('mongoose');
var util        = require('util');
var fs          = require('fs');
var app         = express.createServer();

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
    
    app.listen(3000);
    console.log('Express server started on port %s', app.address().port);
} catch (error) {
    util.log(error);
}