const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');

const Users = new Schema({
    username: String,
    hash: String,
    salt: String,
})

Users.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};
  
Users.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};
  
module.exports = mongoose.model('Users', Users);