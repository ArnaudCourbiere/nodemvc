var mongoose        = require('mongoose');
var mongooseTypes   = require('mongoose-types');
var Schema          = mongoose.Schema;

var Comment = new Schema({
    title   : { type: String, required: true },
    content : { type: String, required: true },
    date    : { type: Date, required: true },
    authro  : { type: String, require: false }
});

var Post = new Schema({
    author          : { type: ObjectId, required: true },
    title           : { type: String, required: true, index: { unique: true } },
    content         : { type: String, required: true },
    dateCreated     : { type: Date, required: true },
    dateModified    : { type: Date, required: false },
    comments        : [Comment]
    tags            : {
        label: { type: String, require: true }
    }
});

mongoose.model('Post', Post);
mongoose.model('Comment', Comment);
