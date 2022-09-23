const pool = require("../../config/database");
const crypto = require("crypto")
const bcrypt = require("bcrypt");


module.exports = {
  create: (data, callBack) => {
    pool.query(
     `insert into access_keys(user,institution,created_at,expire_at,procure_at,status,institution_email) values (?,?,?,?,?,'active',?)`,
            [data.user, data.institution,data.created_at,data.expire_at,data.procure_at,data.institution_email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
       
      }
    );
  },
  creatependingKey: (data, callBack) => {
    pool.query(
     `insert into requested_keys(user,institution,institution_email,requested_at,status) values (?,?,?,?,'inactive')`,
            [data.user, data.institution,data.institution_email,data.requested_at],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
       
      }
    );
  },
  getAllkeyByinstitution: (data, callBack) => {
    pool.query(
      `select * from access_keys where institution_email = ?`,
      [data.email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getActivekeyByinstitution: (data, callBack) => {
    pool.query(
      `select * from access_keys where status = 'active' and institution_email =? `,
      [data.email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  checkUserEmailExist: (email, callBack) => {
    pool.query(
      `select * from admin where email = ?  `,
      [body.email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getkeyById: (id, callBack) => {
    pool.query(
      `select * from access_keys where key_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  pendingKey: ( callBack) => {
    pool.query(
      `select * from requested_keys where status = 'inactive' `,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getKey: callBack => {
    pool.query(
      `select * from access_keys`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  revoke: (data, callBack) => {
    pool.query(
      `update access_keys set status='inactive' where key_id = ?`,
      [
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
      `update access_keys set password=? where email = ?`,
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
      `update access_keys set verified='True' where email = ?`,
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
      `delete from access_keys where email = ?`,
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
