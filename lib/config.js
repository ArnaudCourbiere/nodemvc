/**
 * TODO
 */
exports = module.exports;

exports.config = {
    env: 'dev',
    views: {
        engine: undefined
    }
};

exports.setConfig = function (cfg) {
    for (var prop in cfg) {
        exports.config[prop] = cfg[prop];
    }
};
