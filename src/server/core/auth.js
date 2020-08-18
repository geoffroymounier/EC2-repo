const Auth = require('../models/auth.js')
const { signRequestToken } = require('../routes/middlewares')

module.exports = {
  findEmail: (email) => {
    return new Promise((resolve, reject) => {
      Auth.findOne({ email }).then((user) => {
        if (!user) reject('no user found') //no user with this email
        else resolve(user._id)
      }).catch(err => {
        reject(err)
      })
    })
  },
  login: (params) => {
    return new Promise(function (resolve, reject) {
      const { email, password } = params
      Auth.findOne({ email: params.email })
        .then((auth) => {
          auth.comparePassword(params.password, (err, isMatch) => {
            const userId = auth.userId.toString()
            if (isMatch) {
              const token = signRequestToken({ userId })
              resolve(token);
            } else {
              reject("Wrong password/email");
            }
          })
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  resetPass: (authId, password) => {
    return new Promise(function (resolve, reject) {
      Auth.findOne({ _id: authId }).then(auth => {
        auth.password = password
        auth.save((err) => {
          if (err) reject(err)
          else resolve();
        })
      }).catch((err) => {
        reject("User not found, error: " + err)
      })
    })
  },
  update: (params, userId) => {
    return new Promise(function (resolve, reject) {
      Auth.findOne({ userId })
        .then((auth) => {
          if (!auth) {
            return reject({ status: 404, message: 'Auth not found' })
          }
          auth.comparePassword(params.password, (err, isMatch) => {
            if (isMatch) {
              auth.password = params.newpassword || params.password
              if (params.newmail) auth.email = params.newmail
              auth.save(function (err) {
                if (err) reject(err)
                else {
                  const token = signRequestToken({ userId });
                  resolve(token);
                }
              })
            } else {
              reject({ status: 401, message: 'Wrong password' })
            }
          })
        }).catch((err) => {
          reject({ status: 500, message: err })
        })
    })
  }
}
