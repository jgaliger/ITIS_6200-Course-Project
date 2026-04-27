const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentDatabase = new Schema ({
    title: {type: String, required: [true,'Please enter a document name.']},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    content: {type: Buffer},
    tag: {type: Buffer},
    filePath: {type: String },
    accepted: {type: Boolean, default: false},
    pending: {type: Boolean, default: false},
    messageKey: {type: Buffer},
    IV: {type: Buffer},
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    ratchet: {type: Buffer}
});

module.exports = mongoose.model('Document', documentDatabase);


