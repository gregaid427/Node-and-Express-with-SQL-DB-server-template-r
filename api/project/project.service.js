const pool = require("../../config/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      `insert into projects(title, location, date, image) 
                values(?,?,?,?)`,
      [
        data.title,
        data.location,
        data.date,
        data.image
      
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  // getUserByUserEmail: (email, callBack) => {
  //   pool.query(
  //     `select * from project where email = ?`,
  //     [email],
  //     (error, results, fields) => {
  //       if (error) {
  //         callBack(error);
  //       }
  //       return callBack(null, results[0]);
  //     }
  //   );
  // },
  getProjectById: (id, callBack) => {
    pool.query(
      `select * from projects where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getProject: callBack => {
    pool.query(
      `select # from projects`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updateProject: (data, callBack) => {
    pool.query(
      `update projects set title=?, location=?, date=?, image=? where id = ?`,
      [
        data.title,
        data.location,
        data.date,
        data.image,
        data.id
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  deleteProject: (data, callBack) => {
    pool.query(
      `delete from projects where id = ?`,
      [data.id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  }
};
