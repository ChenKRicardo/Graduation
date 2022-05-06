const express = require("express");
const admin = express.Router();
const db = require("../mysql");
const { makePassword, checkPassword } = require("../src/utils");
const { validators, validate } = require("../src/validate");
const {sign,getPayLoadToken} = require("./jwt")
//管理员注册
admin.post(
  "/adminRegister",
  validate([
    validators.userID,
    validators.password,
    validators.confirmPassword,
  ]),
  async (req, res) => {
    const { userID, password } = req.body;
    const exit = await db.findOne("select * from admin where userID = ?", [
      userID,
    ]);
    if (exit) {
      return res.send({
        success: false,
        message: "账号已存在",
      });
    }
    let [
      result,
    ] = await db.query("insert into admin(userID,password) values(?,?)", [
      userID,
      makePassword(password),
    ]);
    let admin = await db.findOne("select * from admin where userID =?", [
      result.insertId,
    ]);
    res.send({
      success: true,
      code: 200,
      message: "注册成功",
      data: admin,
    });
  }
);
//管理员登录
admin.post(
  "/admin/login",
  validate([validators.userID, validators.password]),
  async (req, res) => {
    const { userID, password } = req.body;
    let admin = await db.findOne("select * from admin where userID = ?", [
      userID,
    ]);
    if (admin && checkPassword(password, admin.password)) {
      req.session.userID = admin.userID
      let token = sign({userID:admin.userID});
      res.json({
        success: true,
        code: 200,
        message: "登录成功",
        data: { roles: admin.roles, token },
      });
    } else {
      res.json({
        success: false,
        message: "登录失败",
      });
    }
  }
);
//登录后才能进行以下操作
admin.use(async (req, res, next) => {
  //从请求头获得令牌
  const {token} = req.headers
  const payload = getPayLoadToken(token)
  //获取用户ID
  const userID = payload?.userID || req.session.userID
  if (!userID) {
    return res.status(401).send({
      success: false,
      message: "请先登录",
    });
  }
  req.admin = await db.findOne("select * from admin where userID =?", [
    userID,
  ]);
  next();
});
//获取管理员信息
admin.get("/getAdminInfo", async (req, res) => {
  res.json({
    success: true,
    code: 200,
    message: "获取管理员信息成功",
    data: req.admin,
  });
});
//管理员退出登录
admin.get("/admin/logout", (req, res) => {
  req.session.destroy()
  res.json({
    success: true,
    code: 200,
    message: "退出登录成功",
  });
});
//查询所有成绩
admin.get(
  "/adminSearchAllScore/:page/:limit",
  validate([validators.page, validators.limit]),
  async (req, res) => {
    let { total } = await db.findOne("select count(*) total from score");
    let { NineToTen } = await db.findOne(
      "select count(*) NineToTen from score where totalScore between 90 and 100"
    );
    let { EightToNine } = await db.findOne(
      "select count(*) EightToNine from score where totalScore between 80 and 90"
    );
    let { SevenToEight } = await db.findOne(
      "select count(*) SevenToEight from score where totalScore between 70 and 80"
    );
    let { SixToSeven } = await db.findOne(
      "select count(*) SixToSeven from score where totalScore between 60 and 70"
    );
    let { SixToLow } = await db.findOne(
      "select count(*) SixToLow from score where totalScore<60 "
    );
    let totalPage = Math.ceil(total / req.params.limit);
    let currentPage = req.params.page; //当前页
    let pageSize = req.params.limit; //当前页的数量
    const params = [
      (parseInt(currentPage) - 1) * parseInt(pageSize),
      parseInt(pageSize),
    ];
    let sql = "select * from score limit ?,?";
    let [results] = await db.query(sql, params);
    res.json({
      success: true,
      code: 200,
      data: results,
      total,
      totalPage,
      currentPage,
      pageSize,
      NineToTen,
      EightToNine,
      SevenToEight,
      SixToSeven,
      SixToLow,
    });
  }
);
//统计论文情况
admin.get("/statisticsGraduationInfo/:page/:limit", async (req, res) => {
  let { total } = await db.findOne("select count(*) total from graduation");
  let { commiting } = await db.findOne(
    "select count(*) commiting from graduation where commitStatus = '已提交'"
  );
  console.log({total});
  let { unCommit } = await db.findOne(
    "select count(*) unCommit from graduation where commitStatus = '未提交'"
  );
  let { passed } = await db.findOne(
    "select count(*) passed from graduation where result = '已通过'"
  );
  let { failed } = await db.findOne(
    "select count(*) failed from graduation where result = '未通过'"
  );
  let totalPage = Math.ceil(total / req.params.limit);
  let currentPage = req.params.page; //当前页
  let pageSize = req.params.limit; //当前页的数量
  const params = [
    (parseInt(currentPage) - 1) * parseInt(pageSize),
    parseInt(pageSize),
  ];
  let sql = "select * from graduation limit ?,?";
  let [results] = await db.query(sql, params);
  res.json({
    success:true,
    code:200,
    data:results,
    total,
    totalPage,
    currentPage,
    pageSize,
    commiting,
    unCommit,
    passed,
    failed
  })
});
//统计开题报告信息
admin.get("/statisticsOpeningInfo/:page/:limit", async (req, res) => {
  let { total } = await db.findOne("select count(*) total from opening");
  let { commiting } = await db.findOne(
    "select count(*) commiting from opening where commitStatus = '已提交'"
  );
  console.log({total});
  let { unCommit } = await db.findOne(
    "select count(*) unCommit from opening where commitStatus = '未提交'"
  );
  let { passed } = await db.findOne(
    "select count(*) passed from opening where result = '已通过'"
  );
  let { failed } = await db.findOne(
    "select count(*) failed from opening where result = '未通过'"
  );
  let totalPage = Math.ceil(total / req.params.limit);
  let currentPage = req.params.page; //当前页
  let pageSize = req.params.limit; //当前页的数量
  const params = [
    (parseInt(currentPage) - 1) * parseInt(pageSize),
    parseInt(pageSize),
  ];
  let sql = "select * from opening limit ?,?";
  let [results] = await db.query(sql, params);
  res.json({
    success:true,
    code:200,
    data:results,
    total,
    totalPage,
    currentPage,
    pageSize,
    commiting,
    unCommit,
    passed,
    failed
  })
});
//统计文献综述信息
admin.get("/statisticsLiteratureInfo/:page/:limit", async (req, res) => {
  let { total } = await db.findOne("select count(*) total from literature");
  let { commiting } = await db.findOne(
    "select count(*) commiting from literature where commitStatus = '已提交'"
  );
  console.log({total});
  let { unCommit } = await db.findOne(
    "select count(*) unCommit from literature where commitStatus = '未提交'"
  );
  let { passed } = await db.findOne(
    "select count(*) passed from literature where result = '已通过'"
  );
  let { failed } = await db.findOne(
    "select count(*) failed from literature where result = '未通过'"
  );
  let totalPage = Math.ceil(total / req.params.limit);
  let currentPage = req.params.page; //当前页
  let pageSize = req.params.limit; //当前页的数量
  const params = [
    (parseInt(currentPage) - 1) * parseInt(pageSize),
    parseInt(pageSize),
  ];
  let sql = "select * from literature limit ?,?";
  let [results] = await db.query(sql, params);
  res.json({
    success:true,
    code:200,
    data:results,
    total,
    totalPage,
    currentPage,
    pageSize,
    commiting,
    unCommit,
    passed,
    failed
  })
});
module.exports = admin;
