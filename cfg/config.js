/**
 * TODO
 */
var _ = require('underscore');
exports = module.exports;

exports.config = {
    env: 'dev',
    views: {
        engine: 'ejs'
    }
};

exports.setConfig = function (cfg) {
    _.extend(exports.config, cfg);
};
