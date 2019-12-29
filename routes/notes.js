const errors = require("restify-errors");
const rjwt = require('restify-jwt-community');

const config = require("../config/config");

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
      "select * from notes where id=?",
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
  server.post("/notes",rjwt({secret:config.JWT_SECRET}), (req, res, next) => {
    // Check for JSON
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }
    let data = req.body;
    con.query("insert into notes set ?", data, (err, fields) => {
      if (err) return next(new errors.InternalError(err.message));
      res.json({ msg: "Note was created" });
    });
    next();
  });
  server.put("/notes/:id",rjwt({secret:config.JWT_SECRET}), (req, res, next) => {
    // Check for JSON
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }
    con.query(
      "update `notes` set `Title`=?,`Content`=? where `Id`=?",
      [req.body.Title, req.body.Content, req.params.id],
      (err, results, fields) => {
        // let affected = results.changedRows;
        if (err) {
          return next(
            new errors.ResourceNotFoundError(
              `There is no notes with the id of ${req.params.id}`
            )
          );
        }
        res.json({ msg: "notes was updated" });
      }
    );
    next();
  });
  server.del("/notes/:id",rjwt({secret:config.JWT_SECRET}), (req, res, next) => {
    con.query(
      "delete from `notes` where `Id`=?",
      [req.params.id],
      (err, results, fields) => {
        let affected = results.affectedRows;
        if (err || affected==0) {
          return next(
            new errors.ResourceNotFoundError(
              `There is no customer with the id of ${req.params.id}`
            )
          );
        }
        // res.json(results)
        res.json({ msg: "Note was deleted" });
      }
    );
    next();
  });
};
