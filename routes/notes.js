const errors = require("restify-errors");

module.exports = (server, con) => {
  server.get("/notes", (req, res, next) => {
    con.query("select * from notes", (err, results, fields) => {
      if (err) console.error(err);
      res.json(results);
    });
    next();
  });
  server.get("/notes/:id", (req, res, next) => {
    con.query(
      "select * from notes where id=?",
      [req.params.id],
      (err, results, fields) => {
        if (err) return next(new errors.InvalidContentError(err));
        res.json(results);
      }
    );
    next();
  });
  server.post("/notes", (req, res, next) => {
    // Check for JSON
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }
    let data = req.body;
    con.query("insert into notes set ?", data, (err, results, fields) => {
      if (err) console.error(err);
      res.json(results);
    });
    next();
  });
  server.put("/notes/:id", (req, res, next) => {
    // Check for JSON
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }
    con.query(
      "update `notes` set `Title`=?,`Content`=? where `Id`=?",
      [req.body.Title, req.body.Content, req.params.id],
      (err, results, fields) => {
        if (err) console.error(err);
        res.json(results);
      }
    );
    next();
  });
  server.del("/notes/:id", (req, res, next) => {
    con.query(
      "delete from `notes` where `Id`=?",
      [req.params.id],
      (err, fields) => {
        if (err) console.error(err);
        res.end("Note is deleted");
      }
    );
    next();
  });
};
