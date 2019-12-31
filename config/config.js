"use strict";

const mysql = require("mysql2");
require("dotenv").config();

module.exports = {
  NAME: "restify-api",
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  URL: process.env.BASE_URL || "http://localhost:3000",
  DB: {
    get: mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      multipleStatements: true
    })
  },
  SALT: process.env.SALT || 14,
  JWT_SECRET: process.env.JWT_SECRET || "secretlysecreteverjwttokengenerate",
  JWT_ISSUER:process.env.JWT_ISSUER || "https://fbk.com.np",
  JWT_EXP:process.env.JWT_EXP || "1d"
};
