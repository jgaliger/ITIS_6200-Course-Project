const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const bobKeyDatabase = new Schema ({
    IKb_public: {type: Buffer},
    IKb_private: {type: Buffer},
    SPKb_public: {type: Buffer},
    SPKb_private: {type: Buffer},
    OPKb_public: {type: Buffer},
    OPKb_private: {type: Buffer},
    SharedKey: {type:Buffer}
});

module.exports = mongoose.model('bobKey', bobKeyDatabase);