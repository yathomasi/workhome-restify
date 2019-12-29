const bcrypt = require("bcryptjs");
const config = require("../config/config");

const con = config.DB.get;

con.connect(err => {
  if (err) console.log(err);
  //   console.log("Connected to database");
});
module.exports = {
  auhenticate: (email, password) => {
    return new Promise((resolve, reject) => {
      const sql = "select * from users where email=?";
      con.query(sql, [email], (err, results, fields) => {
        if (err) throw err;
        if (results.length > 0) {
          bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) reject("Password did not match");
            resolve(results[0]);
          });
        } else {
          reject("Authenticaion Failed");
        }
      });
    });
  }
};
