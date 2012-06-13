var mongoose        = require('mongoose');
var mongooseTypes   = require('mongoose-types');
var Schema          = mongoose.Schema;

var User = new Schema({
    fbid        : {type: String, required: false},
    userName    : {type: String, required: true, index: {unique: true}},
    firstName   : {type: String, required: false},
    lastName    : {type: String, required: false},
    password    : {type: String, required: true, index: {unique: true}},
    ip          : {type: String, required: false}
});

mongoose.model('User', User);

/*
var User = mongoose.model('User');

var user = new User({
    userName: 'arnaud',
    password: 'dsfgdgrergthr'
});

user.save();
console.log(user);
*/
