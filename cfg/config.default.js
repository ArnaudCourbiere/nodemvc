/**
 * TODO
 */
var _ = require('underscore');
exports = module.exports;

config = {
    env: 'dev',
    dir: {
        public: __dirname  + '/../../../public/',
        images: __dirname  + '/../../../public/images/',
        models: __dirname  + '/../../../models/',
        views: __dirname  + '/../../../views/',
        controllers: __dirname  + '/../../../controllers/'
    },
    view: {
        engine: 'ejs'
    }
}

exports.config = config;

exports.configure = function (name, value) {
    
}
