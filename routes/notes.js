const jwt = require("jsonwebtoken");
const errors = require("restify-errors");
const rjwt = require("restify-jwt-community");

const config = require("../config/config");

function jwt_verify(token, next) {
  let userid = jwt.verify(
    token,
    config.JWT_SECRET,
    { expiresIn: "1d" },
    (err, decoded) => {
      if (err) {
        return next(new errors.UnauthorizedError(err));
      }
      return decoded.user.user_id;
    }
  );
  return userid;
}
module.exports = (server, con) => {
  server.get("/notes", (req, res, next) => {
    con.query("select * from notes", (err, results, fields) => {
      if (err) return next(new errors.InvalidContentError(err));
      res.json(results);
    });
    next();
  });
  server.get("/notes/:id", (req, res, next) => {
    con.query(
      "select * from notes where note_id=?",
      [req.params.id],
      (err, results, fields) => {
        if (err || results == "") {
          return next(
            new errors.ResourceNotFoundError(
              `There is no notes with the id of ${req.params.id}`
            )
          );
        }
        res.json(results);
      }
    );
    next();
  });
  server.post(
    "/notes",
    rjwt({ secret: config.JWT_SECRET }),
    (req, res, next) => {
      let token = "";
      if (req.headers.authorization)
        token = req.headers.authorization.split("Bearer ")[1];
      let userid = jwt_verify(token, next);
      // Check for JSON
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }
      let { title, content } = req.body;
      con.query(
        "insert into notes set users_user_id=?,title=?,content=?",
        [userid, title, content],
        (err, fields) => {
          if (err) return next(new errors.InternalError(err.message));
          res.json({ msg: "Note was created" });
        }
      );
      next();
    }
  );
  server.put(
    "/notes/:id",
    rjwt({ secret: config.JWT_SECRET }),
    (req, res, next) => {
      let token = "";
      if (req.headers.authorization)
        token = req.headers.authorization.split("Bearer ")[1];
      let userid = jwt_verify(token, next);
      // Check for JSON
      if (!req.is("application/json")) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }
      con.query(
        "select users_user_id from notes where note_id=?",
        [req.params.id],
        (err, results, fields) => {
          if (err) {
            return next(
              new errors.ResourceNotFoundError(
                `There is no notes with the id of ${req.params.id}`
              )
            );
          } else if (!results.length > 0) {
            return next(
              new errors.ResourceNotFoundError(
                `There is no notes with the id of ${req.params.id}`
              )
            );
          } else if (results[0].users_user_id == userid) {
            con.query(
              "update `notes` set `title`=?,`content`=? where `note_id`=?",
              [req.body.title, req.body.content, req.params.id],
              (err, results, fields) => {
                // let affected = results.changedRows;
                if (err) {
                  return next(
                    new errors.ResourceNotFoundError(
                      `There is no notes with the id of ${req.params.id}`
                    )
                  );
                }
                res.json({ msg: "Note is updated" });
              }
            );
          } else {
            return next(
              new errors.UnauthorizedError("You are unathorized to update.")
            );
          }
        }
      );

      next();
    }
  );
  server.del(
    "/notes/:id",
    rjwt({ secret: config.JWT_SECRET }),
    (req, res, next) => {
      let token = "";
      if (req.headers.authorization)
        token = req.headers.authorization.split("Bearer ")[1];
      let userid = jwt_verify(token, next);
      con.query(
        "select users_user_id from notes where note_id=?",
        [req.params.id],
        (err, results, fields) => {
          // console.log(results);
          if (err) {
            return next(
              new errors.ResourceNotFoundError(
                `There is no notes with the id of ${req.params.id}`
              )
            );
          } else if (!results.length > 0) {
            return next(
              new errors.ResourceNotFoundError(
                `There is no notes with the id of ${req.params.id}`
              )
            );
          } else if (results[0].users_user_id == userid) {
            con.query(
              "delete from `notes` where `note_id`=? limit 1",
              [req.params.id],
              (err, results, fields) => {
                // console.log(results)
                let affected = results.affectedRows;
                if (err || affected == 0) {
                  return next(
                    new errors.ResourceNotFoundError(
                      `There is no notes with the id of ${req.params.id}`
                    )
                  );
                }
                // res.json(results)
                res.json({ msg: "Note was deleted" });
              }
            );
          } else {
            return next(
              new errors.UnauthorizedError("You are unathorized to delete.")
            );
          }
        }
      );
      next();
    }
  );
};
