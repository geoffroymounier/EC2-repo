const mongoose = require('mongoose'), Model = mongoose.model;
const auth = require('../schemas/auth.js');
const {hashPassword,comparePassword} = require('../routes/middlewares.js');

auth.pre('save', function (next) {
  hashPassword(this.password)
  .then((hashedPassword) => {
      this.password = hashedPassword;
      next();
  })
  .catch(err => next(err))
})
auth.methods.comparePassword=function(candidatePassword,next){
  comparePassword(candidatePassword,this.password)
  .then(isMatch => next(null,isMatch))
  .catch(error => next(error))
}

module.exports = Model("Auth",auth);
