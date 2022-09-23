const {
  create,
  getAllkeyByinstitution,
  getkeyById,
  getKey,
  revoke,
  pendingKey,
  creatependingKey,
  getActivekeyByinstitution,
  deleteUser,
  updateStatus,
  updatePassword,
} = require("./keys.service");
// const { hash, genSalt, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
var createHash = require("hash-generator");


module.exports = {
  createKey: (req, res) => {
    const body = req.body;

    create(body, (err, results) => {
      console.log(results);
      console.log(err);
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }  
     

      return res.status(200).json({
        success: 1,
        data: results,
        Verification: "Key Created successfully",
      });
    });
  },

  creatependingKeys: (req, res) => {
    const body = req.body;

    creatependingKey(body, (err, results) => {
      console.log(results);
      console.log(err);
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }  
     

      return res.status(200).json({
        success: 1,
        data: results,
        Verification: "Key Created successfully",
      });
    });
  },

  getkeyById: (req, res) => {
    const id = req.params.id;
    getkeyById(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not Found",
        });
      }
      results.password = undefined;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getKeys: (req, res) => {
    getKey((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.send(
        results
      );
    });
  },
  pendingKeys: (req, res) => {
    pendingKey((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getAllkeysByinstitution: (req, res) => {
    const body = req.params;
    getAllkeyByinstitution(body,(err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getActivekeyByinstitution: (req, res) => {
    const body = req.params;
    getActivekeyByinstitution(body,(err, results) => {
      if (err) {
        console.log(err);
        return;
      }
  console.log(err);
  console.log("hhh"+results[0]);
 
      if((results[0]) === undefined){
        console.log("emty")
        return res.sendStatus(404)
      }
      else{ 

        return  res.json({
        success: 1,
        data: results,
      });}
   
    });
  },
  revokeKey: (req, res) => {
    const body = req.params;
    revoke(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        message: "key revoked successfully",
      });
    });
  },
  verifymail: (req, res) => {
    const body = req.params;
    console.log(body);

    //check if email exists
    getUserByUserEmail(body.email, (err, results) => {
      if (!results) {
        console.log(err);
        return res.json({
          success: 0,
          message: "Link Error",
          errMessage: "email mismatch",
        });
      }
      console.log(body.email);
      console.log(body.token);
      console.log(results.token);

      //check if token code matches code in db
      if (body.token === results.token) {
        //update status in db
        updateStatus(body, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          return res.json({
            success: 1,
            message: "Verified successfully",
          });
        });
      } else {
        //throw error when code mismatches
        return res.json({
          success: 0,
          message: "Linkzzz Error",
          errMessage: "code mismatch",
        });
      }
      const data = results.email;
      console.log(data);
    });
  },
  //it takes email, token sent by mail and new password to update existing password
  resetPassword: (req, res) => {
    const body = req.body;
    getUserByUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
      //checking wether posted token matches db token
      try {
        var decoded = jwt.verify(body.token, "qwe1234");
      } catch (err) {
        return res.json({
          success: 0,
          message: "Lnk Expired/Error",
        });
      }

      console.log(decoded);
      if (decoded.data === results.token) {
        const salt = bcrypt.genSaltSync(10);
        body.password = bcrypt.hashSync(body.password, salt);
        updatePassword(body, (err, results) => {
          if (err) {
            console.log(err);
            return;
          }
          return res.json({
            success: 1,
            message: "updated successfully",
          });
        });
      } else {
        return res.json({
          success: 0,
          message: "Link Error",
        });
      }
    });
  },

  //responsible for verifying email exist and then send out an email
  mailPasswordreset: (req, res) => {
    const body = req.body;
    getUserByUserEmail(body.email, (err, results) => {
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
      if (!err) {
        const signedToken = jwt.sign({ data: results.token }, "qwe1234", {
          expiresIn: "1h",
        });
        console.log(signedToken);
        var mailOptions = {
          from: 'Support "seedo@seedogh.com"',
          to: body.email,
          subject: "Password Reset",
          html: `<h2>Kindly follow link to reset your password</h2>
      <h4>Please ignore this mail if you did not request for password reset</h2>
      <a href=" http://${req.headers.host}/newpassword/users/${body.email}/verify/${signedToken}" > click this link to verify Email </a>
      <h4>Link expires in 1 hour</h2>
      `,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log("mail not sent");
            return res.json({
              success: 0,
              data: "mail not sent",
            });
          } else {
            console.log("verification mail sent");
            return res.json({
              success: 1,
              data: "verification mail sent",
            });
          }
        });
      }
    });
  },

  deleteUser: (req, res) => {
    const data = req.body;
    getUserByUserEmail(data.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Record Not Found",
        });
      }
      deleteUser(data.email, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }

        return res.json({
          success: 1,
          message: "user deleted successfully",
        });
      });
    });
  },
};

// geting email from db
// getUserByUserEmail(data.email, (err, results) => {
//   if (err) {
//     console.log(err);
//   }
//   if (!results) {
//     return res.json({
//       success: 0,
//       data: "Record Not Found"
//     });
//   }});

// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const msg = {
//   to: 'gregoryd428@gmail.com', // Change to your recipient
//   from: 'gregoryd427@gmail.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })
