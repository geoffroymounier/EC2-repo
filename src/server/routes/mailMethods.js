const nodemailer = require("nodemailer");

const mailTransport = nodemailer.createTransport({
  host: '***HOST***',
  port: '***PORT***',
    secure: true, // use SSL
    auth: {
        user: '***REMOVED***.***REMOVED***@ourcompany.com',
        pass: '***REMOVED***'
    }
})

module.exports = {
  sendResetPasswordMail : function(hostname,email,userId,token){
    return new Promise(async function(resolve,reject) {
      const portWebpack = process.env.PORT_WEBPACK || '8008';
      const mode = process.env.NODE_ENV;
      const baseUrl = mode === "production" ? `https://${hostname}` : `http://localhost:${portWebpack}`;

      const link = `${baseUrl}/resetPassword?userId=${userId}&token=${token}`;
      const options = {
        from : `Our Company <noreply@ourcompany.com>`,
        to: email,
        subject: `New link for password change`,
        html: `<div><p><strong>Change your pass for [OUR COMPANY]</strong></p><br/><p>Please click on the link below :</p><br/>
        <p><a href=${link}>${link}</a></p></div>`
      };
      mailTransport.sendMail(options)
      .then(() => resolve())
      .catch((e) => reject(e))
    })
  }
}
