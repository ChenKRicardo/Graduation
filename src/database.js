const mysql = require('mysql');

//将回调函数封装为Promise方式
class MySql {
  constructor(config) {
    //产生数据连接池对象：pool
    this.pool = mysql.createPool(config);
  }
  //query 执行SQL语句
  query(sql, values) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, values, (error, results, fields) => {
        if (error) return reject(error);
        resolve([results, fields]);
      });
    });
  }
  //只返回一条记录，适合执行聚合语句
  async findOne(sql, values) {
    const [
      [one]
    ] = await this.query(sql, values);
    return one;
  }
  //关闭连接池对象
  close() {
    return new Promise((resolve, reject) => {
      this.pool.end((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
module.exports = {
  MySql
}