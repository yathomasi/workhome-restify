"use strict";

const mysql = require("mysql2");
require("dotenv").config();

module.exports = {
  NAME:"restify-api",
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  URL: process.env.BASE_URL || "http://localhost:3000",
  JWT_SECRET: process.env.JWT_SECRET || "secretlysecreteverjwttokengenerate",
  DB: {
    get: mysql.createConnection({
      host: process.env.DB_HOST ,
      user: process.env.DB_USER ,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME 
    })
  }
};
