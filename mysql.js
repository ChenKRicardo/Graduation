//连接数据库
const { MySql } = require("./src/database");
const db = new MySql({
  host: "localhost",
  user: "root",
  password: "ck200072",
  database: "graduate",
  connectionLimt: 10,
});
module.exports = db