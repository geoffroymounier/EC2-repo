const redis = require('redis');
const client = redis.createClient();

module.exports = {
  createResetPasswordToken : (userId) => {
    const token = Math.random().toString(36).substr(2);
    return new Promise((resolve,reject) =>{
      client.set('resetPasswordTokenForUserId:'+userId,token,'EX', 1800 ,(err,reply)=>{
        if (err) reject(err);
        else resolve(token);
      })
    })
  },
  getResetPasswordToken : (userId) => {
    return new Promise((resolve,reject) =>{
      client.get('resetPasswordTokenForUserId:'+userId,(err,token)=>{
        if (err) reject(err);
        else {
          client.del('resetPasswordTokenForUserId:'+userId,(err)=>{
            //remove token so that it cant be used next time
            if (err) reject(err);
            else resolve(token);
          })
        }
      })
    })
  }
}
