const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

//simple schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  //give different access rights if admin or not 
  isAdmin: Boolean
});

UserSchema.methods.generateAuthToken = function () {
  //get the private key from the config file -> environment variable
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('myprivatekey'));
  return token;
};

const User = mongoose.model('User', UserSchema);

//function to validate user 
const validateUser = (user) => {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(3).max(255).required()
  };

  return Joi.validate(user, schema);
}

module.exports = {
  User,
  validate: validateUser,
};