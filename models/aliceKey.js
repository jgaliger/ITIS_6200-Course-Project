const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const aliceKeyDatabase = new Schema ({
    IKa_public: {type: Buffer},
    IKa_private: {type: Buffer},
    EKa_public: {type: Buffer},
    EKa_private: {type: Buffer},
    SharedKey: {type:Buffer},
});



module.exports = mongoose.model('aliceKey', aliceKeyDatabase);

