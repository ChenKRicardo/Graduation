const express = require("express");
const teacher = express.Router();
//加密密码
const { makePassword, checkPassword } = require("../src/utils");
//引入表单验证
const { validators, validate } = require("../src/validate");
const db = require("../mysql");
const { sign, getPayLoadToken } = require("./jwt");
//教师注册
teacher.post(
  "/teacherRegister",
  validate([
    validators.teacherName,
    validators.userID,
    validators.password,
    validators.academy,
    validators.jobTitle,
    validators.phone,
    validators.mailbox,
  ]),
  async (req, res) => {
    const {
      teacherName,
      userID,
      password,
      academy,
      jobTitle,
      phone,
      mailbox,
    } = req.body;
    const exit = await db.findOne("select * from teacher where userID = ?", [
      userID,
    ]);
    if (exit) {
      return res.json({
        success: false,
        message: "用户已存在",
      });
    }
    let [
      result,
    ] = await db.query(
      "insert into teacher(teacherName,userID,password,academy,jobTitle,phone,mailbox) values(?,?,?,?,?,?,?)",
      [
        teacherName,
        userID,
        makePassword(password),
        academy,
        jobTitle,
        phone,
        mailbox,
      ]
    );
    let teacher = await db.findOne("select * from teacher where userID =?", [
      result.insertId,
    ]);
    res.json({
      success: true,
      code: 200,
      message: "注册成功",
      data: teacher,
    });
  }
);
//教师登录
teacher.post(
  "/teacher/login",
  validate([validators.userID, validators.password]),
  async (req, res) => {
    const { userID, password } = req.body;
    let teacher = await db.findOne("select * from teacher where userID = ?", [
      userID,
    ]);
    if (teacher && checkPassword(password, teacher.password)) {
      req.session.userID = teacher.userID;
      let token = sign({ userID: teacher.userID });
      res.json({
        success: true,
        code: 200,
        message: "登录成功",
        data: { roles: teacher.roles, token },
      });
    } else {
      res.json({
        success: false,
        message: "登录失败",
      });
    }
  }
);
//登录后才才能进行以下操作
teacher.use(async (req, res, next) => {
  //  //从请求头获得令牌
  const { token } = req.headers;
  const payload = getPayLoadToken(token);
  //获取用户ID
  const userID = payload?.userID || res.session?.userID;
  if (!userID) {
    return res.status(401).send({
      success: false,
      message: "请先登录",
    });
  }
  req.teacher = await db.findOne("select * from teacher where userID =?", [
    userID,
  ]);
  next();
});
//获取教师信息
teacher.get("/getTeacherInfo", async (req, res) => {
  res.json({
    success: true,
    code: 200,
    message: "获取教师信息成功",
    data: req.teacher,
  });
});
//教师修改个人信息
teacher.put(
  "/editTeacherInfo",
  validate([
    validators.teacherName,
    validators.phone,
    validators.mailbox,
    validators.newPassword,
    validators.confirmNewPassword,
  ]),
  async (req, res) => {
    let teacher = await db.findOne("select * from teacher where id = ?", [
      req.teacher.id,
    ]);
    const { teacherName, newPassword, phone, mailbox } = req.body;
    await db.query(
      "update teacher set password =? , teacherName =? , phone =? , mailbox =? where id = ?",
      [makePassword(newPassword), teacherName, phone, mailbox, req.teacher.id]
    );
    teacher = await db.findOne("select * from teacher where id = ?", [
      req.teacher.id,
    ]);
    res.json({
      success: true,
      code: 200,
      message: "个人信息修改成功",
      data: teacher,
    });
  }
);

//教师退出登录
teacher.get("/teacher/logout", (req, res) => {
  req.session.destroy();
  res.json({
    success: true,
    code: 200,
    message: "退出登录成功",
  });
});
//教师创建选题
teacher.post(
  "/teacher/createTpoic",
  validate([
    validators.title,
    validators.openingTeacher,
    validators.specialized,
  ]),
  async (req, res) => {
    const { title, openingTeacher, specialized } = req.body;
    const exit = await db.findOne("select * from createtpoic where title = ?", [
      title,
    ]);
    if (exit) {
      return res.json({
        success: false,
        message: "课题已存在",
      });
    }
    let [
      result,
    ] = await db.query(
      "insert into createtpoic(title, openingTeacher, specialized,teacher_ID) values(?,?,?,?)",
      [title, openingTeacher, specialized, req.teacher.id]
    );
    const topic = await db.findOne("select * from createtpoic where id = ?", [
      result.insertId,
    ]);
    res.json({
      success: true,
      code: 200,
      message: "选题创建成功",
      data: topic,
    });
  }
);
//教师修改选题
teacher.put(
  "/editTpoic/:tpoicId",
  validate([
    validators.title,
    validators.openingTeacher,
    validators.specialized,
  ]),
  async (req, res) => {
    let tpoic = await db.findOne("select * from createtpoic where id = ?", [
      req.params.tpoicId,
    ]);
    const { title, openingTeacher, specialized } = req.body;
    await db.query(
      "update createtpoic set title =?, openingTeacher =?,specialized =? where id = ?",
      [title, openingTeacher, specialized, req.params.tpoicId]
    );
    tpoic = await db.findOne("select * from createtpoic where id = ?", [
      req.params.tpoicId,
    ]);
    res.json({
      success: true,
      code: 200,
      message: "选题信息修改成功",
      data: tpoic,
    });
  }
);
//教师删除选题
teacher.delete("/deleteTpoic/:tpoicId", async (req, res) => {
  let tpoic = await db.findOne(
    "select * from createtpoic where id =? and teacher_ID =?",
    [req.params.tpoicId, req.teacher.id]
  );
  if (!tpoic)
    return res.json({
      success: false,
      message: "该选题不存在",
    });
  if (tpoic.studentName) {
    return res.json({
      success: false,
      message: "选题已被选中不能删除",
    });
  }
  await db.query("delete from createtpoic where id = ?", [req.params.tpoicId]);
  res.json({
    success: true,
    code: 200,
    message: "该选题已删除",
  });
});
//分页查询所有成绩
teacher.get(
  "/teacherSearchAllScore/:page/:limit",
  validate([validators.page, validators.limit]),
  async (req, res) => {
    let { total } = await db.findOne("select count(*) total from score");
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
    });
  }
);
//教师创建学生成绩
teacher.post(
  "/createScore/:studentId",
  validate([
    validators.graduateScore,
    validators.deviseScore,
    validators.ReplyScore,
    validators.totalScore,
  ]),
  async (req, res) => {
    const { graduateScore, deviseScore, ReplyScore, totalScore } = req.body;
    let exit = await db.findOne("select * from score where studentID =? ", [
      req.params.studentId,
    ]);
    if (exit.totalScore) {
      return res.json({
        success: false,
        message: "该学生成绩已创建",
      });
    }

    await db.query(
      "update score set graduateScore=?,deviseScore=?,ReplyScore=?,totalScore=? where studentID =?",
      [graduateScore, deviseScore, ReplyScore, totalScore, req.params.studentId]
    );
    const score = await db.findOne("select * from score where studentID = ?", [
      req.params.studentId,
    ]);
    res.json({
      success: true,
      code: 200,
      data: score,
      message: "成绩创建成功",
    });
  }
);
//教师修改成绩
teacher.put(
  "/editScore/:studentId",
  validate([
    validators.graduateScore,
    validators.deviseScore,
    validators.ReplyScore,
    validators.totalScore,
  ]),
  async (req, res) => {
    let score = await db.findOne("select * from score where studentID = ?", [
      req.params.studentId,
    ]);
    if (
      !score.totalScore &&
      !score.ReplyScore &&
      !score.deviseScore &&
      !score.graduateScore
    ) {
      return res.json({
        success: false,
        message: "暂无成绩信息,请上传该生论文成绩",
      });
    }
    const { graduateScore, deviseScore, ReplyScore, totalScore } = req.body;
    await db.query(
      "update score set graduateScore =?, deviseScore =?,ReplyScore =?,totalScore =? where studentID = ?",
      [graduateScore, deviseScore, ReplyScore, totalScore, req.params.studentId]
    );
    score = await db.findOne("select * from score where studentID = ?", [
      req.params.studentId,
    ]);
    res.json({
      success: true,
      code: 200,
      message: "学生成绩修改成功",
      data: score,
    });
  }
);
//教师查询学生毕业论文信息
teacher.get(
  "/teacherSearchGraduation/:page/:limit",
  validate([validators.page, validators.limit]),
  async (req, res) => {
    let {
      total,
    } = await db.findOne(
      "select count(*) total from graduation where commitStatus =? ",
      ["已提交"]
    );
    let totalPage = Math.ceil(total / req.params.limit);
    let currentPage = req.params.page; //当前页
    let pageSize = req.params.limit; //当前页的数量
    const params = [
      (parseInt(currentPage) - 1) * parseInt(pageSize),
      parseInt(pageSize),
    ];
    let sql =
      "select * from (SELECT * FROM graduation  WHERE commitStatus = '已提交') as t limit ?,? ";
    let [results] = await db.query(sql, params);
    res.json({
      success: true,
      code: 200,
      data: results,
      total,
      totalPage,
      currentPage,
      pageSize,
    });
  }
);
//教师上传审核毕业论文
teacher.post("/auditGraduation/:studentID", async (req, res) => {
  const { teacherName, auditStatus, advice, result } = req.body;
  await db.query(
    "update graduation set teacherName=?,auditStatus=?,advice=?,result=? where studentID =?",
    [teacherName, auditStatus, advice, result, req.params.studentID]
  );
  let graduation = await db.findOne(
    "select * from graduation where studentID =?",
    [req.params.studentID]
  );
  res.json({
    success: true,
    code: 200,
    message: "上传审核毕业论文成功",
    data: graduation,
  });
});
//教师修改论文审核意见
teacher.put("/uploadGraduation/:studentID", async (req, res) => {
  const { teacherName, auditStatus, advice, result } = req.body;
  await db.query(
    "update graduation set teacherName=?,auditStatus=?,advice=?,result=? where studentID =?",
    [teacherName, auditStatus, advice, result, req.params.studentID]
  );
  let graduation = await db.findOne(
    "select * from graduation where studentID =?",
    [req.params.studentID]
  );
  res.json({
    success: true,
    code: 200,
    message: "毕业论文审核意见修改成功",
    data: graduation,
  });
});

//教师查询学生开题报告信息
teacher.get(
  "/teacherSearchOpening/:page/:limit",
  validate([validators.page, validators.limit]),
  async (req, res) => {
    let {
      total,
    } = await db.findOne(
      "select count(*) total from opening where commitStatus =? ",
      ["已提交"]
    );
    let totalPage = Math.ceil(total / req.params.limit);
    let currentPage = req.params.page; //当前页
    let pageSize = req.params.limit; //当前页的数量
    const params = [
      (parseInt(currentPage) - 1) * parseInt(pageSize),
      parseInt(pageSize),
    ];
    let sql =
      "select * from (SELECT * FROM opening  WHERE commitStatus = '已提交') as t limit ?,? ";
    let [results] = await db.query(sql, params);
    res.json({
      success: true,
      code: 200,
      data: results,
      total,
      totalPage,
      currentPage,
      pageSize,
    });
  }
);
//教师上传审核开题报告
teacher.post("/auditOpening/:studentID", async (req, res) => {
  const { teacherName, auditStatus, advice, result } = req.body;
  await db.query(
    "update opening set teacherName=?,auditStatus=?,advice=?,result=? where studentID =?",
    [teacherName, auditStatus, advice, result, req.params.studentID]
  );
  let opening = await db.findOne("select * from opening where studentID =?", [
    req.params.studentID,
  ]);
  res.json({
    success: true,
    code: 200,
    message: "上传审核开题报告成功",
    data: opening,
  });
});
//教师修改开题报告审核意见
teacher.put("/uploadOpening/:studentID", async (req, res) => {
  const { teacherName, auditStatus, advice, result } = req.body;
  await db.query(
    "update opening set teacherName=?,auditStatus=?,advice=?,result=? where studentID =?",
    [teacherName, auditStatus, advice, result, req.params.studentID]
  );
  let Opening = await db.findOne("select * from Opening where studentID =?", [
    req.params.studentID,
  ]);
  res.json({
    success: true,
    code: 200,
    message: "开题报告审核意见修改成功",
    data: Opening,
  });
});

//教师查询学生文献综述信息
teacher.get(
  "/teacherSearchLiterature/:page/:limit",
  validate([validators.page, validators.limit]),
  async (req, res) => {
    let {
      total,
    } = await db.findOne(
      "select count(*) total from literature where commitStatus =? ",
      ["已提交"]
    );
    let totalPage = Math.ceil(total / req.params.limit);
    let currentPage = req.params.page; //当前页
    let pageSize = req.params.limit; //当前页的数量
    const params = [
      (parseInt(currentPage) - 1) * parseInt(pageSize),
      parseInt(pageSize),
    ];
    let sql =
      "select * from (SELECT * FROM literature  WHERE commitStatus = '已提交') as t limit ?,? ";
    let [results] = await db.query(sql, params);
    res.json({
      success: true,
      code: 200,
      data: results,
      total,
      totalPage,
      currentPage,
      pageSize,
    });
  }
);
//教师上传文献综述审核信息
teacher.post("/auditLiterature/:studentID", async (req, res) => {
  const { teacherName, auditStatus, advice, result } = req.body;
  await db.query(
    "update literature set teacherName=?,auditStatus=?,advice=?,result=? where studentID =?",
    [teacherName, auditStatus, advice, result, req.params.studentID]
  );
  let literature = await db.findOne(
    "select * from literature where studentID =?",
    [req.params.studentID]
  );
  res.json({
    success: true,
    code: 200,
    message: "上传审核开题报告成功",
    data: literature,
  });
});
//教师修改文献综述审核意见
teacher.put("/uploadLiterature/:studentID", async (req, res) => {
  const { teacherName, auditStatus, advice, result } = req.body;
  await db.query(
    "update literature set teacherName=?,auditStatus=?,advice=?,result=? where studentID =?",
    [teacherName, auditStatus, advice, result, req.params.studentID]
  );
  let literature = await db.findOne(
    "select * from literature where studentID =?",
    [req.params.studentID]
  );
  res.json({
    success: true,
    code: 200,
    message: "开题报告审核意见修改成功",
    data: literature,
  });
});
module.exports = teacher;
