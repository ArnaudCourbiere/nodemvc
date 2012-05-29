var util        = require('util');
var mongoose    = require('mongoose');

module.exports = function(req, res) {
    res.header('Content-type', 'application/json');
    
    return {
        get: function (resource, id) {
            if (id) {
                mongoose.model(resource).findById(id, function (err, docs) {
                    res.send(docs);
                });
            } else {
                mongoose.model(resource).find({}, function (err, docs) {
                    res.send(docs);
                });
            }
        },
        post: function(resource, body) {
            res.send('post');
        },
        put: function(resource, id, body) {
            res.send('put');
        },
        delete: function (resource, id) {
            res.send('delete');
        }
    }
};