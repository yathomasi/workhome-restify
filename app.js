const restify = require("restify");
// const mysql = require("mysql2");
const corsMiddleware = require("restify-cors-middleware");
const logger = require("morgan");
const config = require("./config/config");
// const rjwt = require('restify-jwt-community');

const server = restify.createServer({
  name: config.NAME,
  url: config.URL
});
const con = config.DB.get;

if (process.env.NODE_ENV == "development") {
  server.use(logger("dev"));
  console.log("Development mode on");
}

//Middleware
const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["Authorization"],
  exposeHeaders: ["Authorization"]
});
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.pre(cors.preflight);
server.use(cors.actual);

// Routers
require("./routes/index")(server);
require("./routes/notes")(server, con);
require("./routes/users")(server, con);

//Protected routes
// server.use(rjwt({secret: config.JWT_SECRET}).unless({path:['/login']}))

server.listen(config.PORT, () => {
  con.connect(err => {
    if (err) console.log(err);
    console.log("Connected to database");
  });
  console.log(`Server running on port ${config.PORT}`);
});
