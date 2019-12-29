const errors = require("restify-errors");

module.exports = server => {
  server.get("/", (req, res, next) => {
    res.json({ msg: "Its running" });
    next();
  });
};
