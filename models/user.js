const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userDatabase = new Schema({
    username: {type: String, required: [true, 'username required']} ,
    password: { type: String, required: [true, 'password is required'] },
});

userDatabase.pre('save', function(){
    let profile = this;
    if (!profile.isModified('password')) return;
    profile.password = bcrypt.hashSync(profile.password, 10);
});

userDatabase.methods.comparePassword = function(inputPassword){
    let user = this
    return bcrypt.compare(inputPassword, user.password);
};
  module.exports = mongoose.model('User', userDatabase);