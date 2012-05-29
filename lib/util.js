var util    = require('util');
var crypto  = require('crypto');

/**
 * Generates and returns a uuid.
 * 
 * @return string
 *      Generated uuid.
 */
util.generateUuid = function () {
    var hash = crypto.createHash('sha1')
                     .update(Math.random().toString() + Math.round((new Date).getTime() / 1000), 'utf8')
                     .digest('hex');
    
    return hash.substring(0, 8) + '-' 
         + hash.substring(8, 12) + '-' 
         + hash.substring(12, 16) + '-' 
         + hash.substring(16, 20) + '-' 
         + hash.substring(20, 32);
};

