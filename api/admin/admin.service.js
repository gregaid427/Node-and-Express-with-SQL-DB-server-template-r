const pool = require("../../config/database");
const crypto = require("crypto")
const bcrypt = require("bcrypt");


module.exports = {
  create: (data, callBack) => {
    pool.query(
     `insert into admin (email,password,verified,token) values (?,?,'false',?)`,
            [data.email, data.password, data.token, ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
        console.log(verificationToken)
      }
    );
  },
  getUserByUserEmail: (email, callBack) => {
    pool.query(
      `select * from admin where email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  checkUserEmailExist: (email, callBack) => {
    pool.query(
      `select email from admin where email = ?  `,
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUserByUserId: (id, callBack) => {
    pool.query(
      `select * from admin where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUsers: callBack => {
    pool.query(
      `select * from admin`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updateUser: (data, callBack) => {
    pool.query(
      `update admin set email=? id = ?`,
      [
        data.email,
        data.id
       
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updatePassword: (data, callBack) => {
    pool.query(
      `update admin set password=? where email = ?`,
      [
       
        data.password,
        data.email
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updateStatus: (data, callBack) => {
    pool.query(
      `update admin set verified='True' where email = ?`,
      [
        data.email
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  deleteUser: (data, callBack) => {
    pool.query(
      `delete from admin where email = ?`,
      [data],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  }
};
