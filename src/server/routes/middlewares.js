const key = require('../key.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken : function(req,res,next){
    let token;
    if (!req.headers.authorization || !req.headers.authorization.split(" ")) {
      return res.status(403).send({
          "error": true,
          "message": 'No token provided.'
      });
    }
    try {
      token = req.headers.authorization.split(" ")[1]
      jwt.verify(token, key.tokenKey, function (err, decoded) {
          if (err) {
            return res.status(403).send({"error":true, "message": 'Unauthorized access.' })
          }
          req.decoded = decoded;
          next();
      })
    } catch(e){
      return res.status(403).send({
          "error": true,
          "message": 'No token provided.'
      });
    }
  },
  signRequestToken : (data) => {
    return jwt.sign(data,key.tokenKey , { expiresIn: key.tokenLife});
  },
  comparePassword : function(candidatePassword,password){
    return new Promise((resolve,reject)=>{
      bcrypt.compare(candidatePassword,password)
      .then(isMatch => resolve(isMatch))
      .catch(err => reject(err))
    })
  },
  hashPassword : function(password) {
    return new Promise((resolve,reject) => {
      bcrypt.hash(password,10).then((hashedPassword) => {
         resolve(hashedPassword);
     }).catch(err=>reject(err))
    })
  }
}
