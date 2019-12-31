const errors = require("restify-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rjwt = require("restify-jwt-community");
const config = require("../config/config");
const auth = require("../auth/auth");

const SECRET = config.JWT_SECRET;
const SALT = Number(config.SALT);

module.exports = (server, con) => {
  server.get(
    "/users",
    rjwt({ secret: config.JWT_SECRET }),
    (req, res, next) => {
      con.query("select user_id,name,username,email from users", (err, results, fields) => {
        if (err) return next(new errors.InvalidContentError(err));
        res.json(results);
      });
      next();
    }
  );
  // Register
  server.post("/register", (req, res, next) => {
    // Check for JSON
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }
    let user = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    };

    con.query(
      "select * from users where email=?;select * from users where username=?",
      [user.email, user.username],
      (err, results, fields) => {
        if (err) return next(new errors.InternalError(err.message));
        // console.log(results)
        if (results[0].length > 0 || results[1].length > 0) {
          res.json({ msg: "user already exists" });
        } else {
          bcrypt.genSalt(SALT, (err, salt) => {
            if (err) return next(new errors.InternalError(err.message));
            bcrypt.hash(user.password, salt, (err, hash) => {
              if (err) return next(new errors.InternalError(err.message));
              // Hash Password
              user.password = hash;
              // Save User
              con.query(
                "insert into users set ?",
                user,
                (err, results, fields) => {
                  if (err) return next(new errors.InternalError(err.message));
                  //   console.log(results);
                  res.send(201);
                  next();
                }
              );
            });
          });
          next();
        }
      }
    );
  });
  server.post("/login", async (req, res, next) => {
    // Check for JSON
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }
    const { email, password } = req.body;
    try {
      // Authenticate User
      const user = await auth.auhenticate(email, password);
      let payload = {
        user_id:user.user_id,
        username:user.username
      };
      // console.log(user);
      const token = jwt.sign(payload, SECRET, {
        issuer:config.JWT_ISSUER,
        expiresIn: config.JWT_EXP,

      });
      const { iat, exp } = jwt.decode(token);
      res.send({ iat, exp, token });
      next();
    } catch (err) {
      // User unauthorized
      return next(new errors.UnauthorizedError(err));
    }
  });
};
