const {
  create,
  getUserByUserEmail,
  getUserByUserId,
  getUsers,
  updateUser,
  deleteUser,
  updateStatus,
  checkUserEmailExist,
  updatePassword,
} = require("./user.service");
// const { hash, genSalt, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
var createHash = require("hash-generator");

// mail sender details
var transporter = nodemailer.createTransport({
  // service: "gmail",
  host: "mail.seedogh.com",
  port: 465,
  auth: {
    user: "seedo@seedogh.com",
    pass: "[MLD-tbil1$g",
  },
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(body.password, salt);
    var hash = createHash(70);

    const bod = {
      email: body.email,
      password: password,
      token: hash,
      institution: body.institution,
    };

    
    getUserByUserEmail(body.email, (err, results) => {
    //check if email exists
    if (!(!results)) {
      console.log("user exist");
      return res.status(500).json({
        success: 0,
        message: "Email Already Taken",
      });
    }
    // if not create user
    else {
      create(bod, (err, results) => {
       
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection errror",
          });
        }

        if (!err) {
          getUserByUserEmail(body.email, (err, results) => {
            // send mail to user email
            var mailOptions = {
              from: 'Support "seedo@seedogh.com"',
              to: results.email,
              subject: "Email Verification",
              html: `<h2>Thanks for registering on our Platform</h2>
              <h4>Kindly follow link to Verify your mail</h2>
              <a href=" http://${req.headers.host}/api/admin/${results.email}/verify/${results.token}" >click this link to verify Email </a>
              `,
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(" mail not sent");
                return res.status(200).json({
                  success: 1,
                  data: results,
                  Verification: "mail not sent",
                });
              } else {
                console.log("verification mail sent");
                return res.status(200).json({
                  success: 1,
                  data: results,
                  Verification: "mail sent",
                });
              }
            });
          });
        }
      });
    }
  });
  },
  login: (req, res) => {
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

      const result = bcrypt.compareSync(body.password, results.password);

      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, "qwe1234", {
          expiresIn: "1h",
        });
        return res.json({
          success: 1,
          message: "login successfully",
          token: jsontoken,
        });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
    });
  },
  getUserByUserId: (req, res) => {
    const id = req.params.id;
    getUserByUserId(id, (err, results) => {
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
  getUsers: (req, res) => {
    getUsers((err, results) => {
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
  updateUsers: (req, res) => {
    const body = req.body;
    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(body.password, salt);
    updateUser(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        message: "updated successfully",
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
      <a href=" http://${req.headers.host}/newpassword/admin/${body.email}/verify/${signedToken}" > click this link to verify Email </a>
      <h4>Link expires in 1 hour</h2>
      `,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log("uumail not sent");
            return res.json({
              success: 0,
              Error: "internet Connectivity issue",
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
