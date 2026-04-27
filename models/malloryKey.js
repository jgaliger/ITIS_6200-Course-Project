const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const malloryKeyDatabase = new Schema({
    IKm_public: Buffer,
    IKm_private: Buffer,
    SPKm_public: Buffer,
    SPKm_private: Buffer,
    OPKm_public: Buffer,
    OPKm_private: Buffer
});

module.exports = mongoose.model('malloryKey', malloryKeyDatabase);