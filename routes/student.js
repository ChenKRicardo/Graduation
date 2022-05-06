const express = require("express");
const student = express.Router();
const db = require("../mysql");
const multer = require("multer");
const path = require("path");
//导入token
const {sign,getPayLoadToken} = require("./jwt")
//加密密码
const { makePassword, checkPassword } = require("../src/utils");
//引入表单验证
const { validators, validate } = require("../src/validate");
const storage = multer.diskStorage({
  destination(req, res, cb) {
    cb(null, path.resolve(__dirname, "..") + "/uploads/graduationPromotion");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const storage1 = multer.diskStorage({
  destination(req, res, cb) {
    cb(null, path.resolve(__dirname, "..") + "/uploads/literaturePromotion");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const storage2 = multer.diskStorage({
  destination(req, res, cb) {
    cb(null, path.resolve(__dirname, "..") + "/uploads/openingPromotion");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage });
const upload1 = multer({ storage1 });
const upload2 = multer({ storage2 });

//学生注册
student.post(
  "/studentRegister",
  validate([
    validators.studentName,
    validators.userID,
    validators.password,
    validators.academy,
    validators.specialized,
    validators.Degree,
    validators.phone,
    validators.mailbox,
  ]),
  async (req, res) => {
    const {
      studentName,
      userID,
      password,
      academy,
      specialized,
      Degree,
      phone,
      mailbox,
    } = req.body;
    const exit = await db.findOne("select * from student where userID = ?", [
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
      "insert into student(studentName,userID,password,academy,specialized,Degree,phone,mailbox) values(?,?,?,?,?,?,?,?)",
      [
        studentName,
        userID,
        makePassword(password),
        academy,
        specialized,
        Degree,
        phone,
        mailbox,
      ]
    );
    let student = await db.findOne("select * from student where userID =?", [
      result.insertId,
    ]);
    res.json({
      success: true,
      code: 200,
      message: "注册成功",
      data: student,
    });
  }
);
//学生登录
student.post(
  "/student/login",
  validate([validators.userID, validators.password]),
  async (req, res) => {
    const { userID, password } = req.body;
    let student = await db.findOne("select * from student where userID = ?", [
      userID,
    ]);
    if (student && checkPassword(password, student.password)) {
      req.session.userID = student.userID
      let token = sign({userID:student.userID});
      res.json({
        success: true,
        code: 200,
        message: "登录成功",
        data: { roles: student.roles, token },
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
student.use(async (req, res, next) => {
  //从请求头获得令牌
  const {token} = req.headers
  const payload = getPayLoadToken(token)
  //获取用户ID
  const userID = payload?.userID || req.session?.userID
  if (!userID) {
    return res.status(401).send({
      success: false,
      message: "请先登录",
    });
  }
  req.student = await db.findOne("select * from student where userID =?", [
    userID,
  ]);
  next();
});
//获取学生信息
student.get("/getStudentInfo", async (req, res) => {
  res.json({
    success: true,
    code: 200,
    message: "获取学生信息成功",
    data: req.student,
  });
});
//学生修改个人信息
student.put(
  "/editStudentInfo",
  validate([
    validators.studentName,
    validators.phone,
    validators.mailbox,
    validators.newPassword,
    validators.confirmNewPassword,
  ]),
  async (req, res) => {
    let student = await db.findOne("select * from student where id = ?", [
      req.student.id,
    ]);
    const { studentName, newPassword, phone, mailbox } = req.body;
    await db.query(
      "update student set password =?, studentName =?,phone =?,mailbox =? where id = ?",
      [makePassword(newPassword), studentName, phone, mailbox, req.student.id]
    );
    student = await db.findOne("select * from student where id = ?", [
      req.student.id,
    ]);
    res.json({
      success: true,
      code: 200,
      message: "个人信息修改成功",
      data: student,
    });
  }
);
//退出登录
student.get("/student/logout", (req, res) => {
  req.session.destroy()
  res.json({
    success: true,
    code: 200,
    message: "退出登录成功",
  });
});
//学生查询选题
student.get("/searchTpoic/:tpoicName", async (req, res) => {
  let result = await db.findOne("select * from createtpoic where title = ?", [
    req.params.tpoicName,
  ]);
  if (!result) {
    return res.send({
      success: false,
      message: "选题不存在",
    });
  }
  res.send({
    success: true,
    code: 200,
    message: "获取选题信息成功",
    data: result,
  });
});
//分页查询所有选题
student.get(
  "/studentSearchAllTpoic/:page/:limit",
  validate([validators.page, validators.limit]),
  async (req, res) => {
    let { total } = await db.findOne("select count(*) total from createtpoic");
    let totalPage = Math.ceil(total / req.params.limit);
    let currentPage = req.params.page; //当前页
    let pageSize = req.params.limit; //当前页的数量
    const params = [
      (parseInt(currentPage) - 1) * parseInt(pageSize),
      parseInt(pageSize),
    ];
    let sql = "select * from createtpoic limit ?,?";
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
//学生勾选选题
student.get("/chooseTpoic/:tpoicid", async (req, res) => {
  let tpoic = await db.findOne("select *  from createtpoic where id = ?", [
    req.params.tpoicid,
  ]);
  if (tpoic.topicStatus == 1) {
    return res.json({
      success: false,
      message: "选题已被您或他人勾选",
    });
  }
  if (!req.student.chooseTitle) {
    await db.query(
      "update createtpoic set studentName =?,topicStatus=? ,studentID = ? where id = ?",
      [req.student.studentName, 1, req.student.userID, req.params.tpoicid]
    );
    tpoic = await db.findOne("select *  from createtpoic where id = ?", [
      req.params.tpoicid,
    ]);
    res.json({
      success: true,
      code: 200,
      message: "选题勾选成功",
      data: tpoic,
    });
  } else {
    res.json({
      success: false,
      message: "您已选题,不能再次选题",
    });
  }
  await db.query("update student set chooseTitle =? where userID = ?", [
    tpoic.title,
    req.student.userID,
  ]);
  let uploadStudentInfo = await db.findOne(
    "select * from student where userID = ?",
    [req.student.userID]
  );
  await db.query(
    "insert into score(studentName,studentID,teacherName,title) values(?,?,?,?)",
    [uploadStudentInfo.studentName,uploadStudentInfo.userID,tpoic.openingTeacher,uploadStudentInfo.chooseTitle]
  );
  await db.query(
    "insert into graduation(studentName,studentID,chooseTitle,commitStatus) values(?,?,?,?)",
    [
      uploadStudentInfo.studentName,
      uploadStudentInfo.userID,
      uploadStudentInfo.chooseTitle,
      "未提交",
    ]
  );
  await db.query(
    "insert into literature(studentName,studentID,chooseTitle,commitStatus) values(?,?,?,?)",
    [
      uploadStudentInfo.studentName,
      uploadStudentInfo.userID,
      uploadStudentInfo.chooseTitle,
      "未提交",
    ]
  );
  await db.query(
    "insert into opening(studentName,studentID,chooseTitle,commitStatus) values(?,?,?,?)",
    [
      uploadStudentInfo.studentName,
      uploadStudentInfo.userID,
      uploadStudentInfo.chooseTitle,
      "未提交",
    ]
  );
});
//学生取消勾选
student.get("/cancleTpoic/:tpoicid", async (req, res) => {
  let tpoic = await db.findOne("select *  from createtpoic where id = ?", [
    req.params.tpoicid,
  ]);
  let score = await db.findOne("select * from score where studentID = ?", [
    req.student.userID,
  ]);
  if (
    req.student.chooseTitle &&
    req.student.chooseTitle == tpoic.title &&
    req.student.userID == tpoic.studentID&&
    !score.totalScore
  ) {
      await db.query(
        "update createtpoic set studentName =?,topicStatus=?,studentID =?  where id = ?",
        [null, 0, null,req.params.tpoicid]
      );
    await db.query("update student set chooseTitle =? where id = ?", [
      null,
      req.student.id,
    ]);
    await db.query("delete  from graduation where studentID = ?", [
      req.student.userID,
    ]);
    await db.query("delete  from literature where studentID = ?", [
      req.student.userID,
    ]);
    await db.query("delete  from opening where studentID = ?", [
      req.student.userID,
    ]);
    await db.query("delete  from score where studentID = ?", [
      req.student.userID,
    ]);
    res.json({
      success: true,
      code: 200,
      message: "该选题已取消勾选",
      data: tpoic,
    });
  } else {
    res.json({
      success: false,
      message: "您还未选则该题或者已有该选题成绩则无法取消勾选",
    });
  }
});
//学生查询成绩
student.get("/studentSearchScore/:studentID", async (req, res) => {
  let score = await db.findOne("select * from score where studentID = ?", [
    req.params.studentID,
  ]);
  if (!score) {
    return res.json({
      success: false,
      message: "暂无成绩信息",
    });
  }
  res.json({
    code: 200,
    success: true,
    message: "成绩查询成功",
    data: score,
  });
});
//论文上传
student.post(
  "/student/graduationUpload",
  upload.single("file"),
  async (req, res) => {
    let uploadStudentInfo = await db.findOne(
      "select * from student where userID = ?",
      [req.student.userID]
    );
    if (!uploadStudentInfo.chooseTitle) {
      return res.json({
        success: false,
        message: "您还未选题禁止上传论文",
      });
    }
    await db.query(
      "update  graduation set commitStatus =? where studentID = ?",
      ["已提交", req.student.userID]
    );
    await db.query(
      "delete from graduation where id not in (select t.min_id from (select min(id) as min_id from graduation group by studentID) as t)"
    );
    res.json({
      success: true,
      code: 200,
      message: "论文上传成功",
      type: "single",
    });
  }
);
//文献综述上传
student.post(
  "/student/literatureUpload",
  upload1.single("file"),
  async (req, res) => {
    let uploadStudentInfo = await db.findOne(
      "select * from student where userID = ?",
      [req.student.userID]
    );
    if (!uploadStudentInfo.chooseTitle) {
      return res.json({
        success: false,
        message: "您还未选题禁止上传文献综述",
      });
    }
    await db.query(
      "update  literature set commitStatus =? where studentID = ?",
      ["已提交", req.student.userID]
    );
    await db.query(
      "delete from literature where id not in (select t.min_id from (select min(id) as min_id from literature group by studentID) as t)"
    );
    res.json({
      success: true,
      code: 200,
      message: "文献综述上传成功",
      type: "single",
    });
  }
);
//开题报告上传
student.post(
  "/student/openingUpload",
  upload2.single("file"),
  async (req, res) => {
    let uploadStudentInfo = await db.findOne(
      "select * from student where userID = ?",
      [req.student.userID]
    );
    if (!uploadStudentInfo.chooseTitle) {
      return res.json({
        success: false,
        message: "您还未选题禁止上传开题报告",
      });
    }
    await db.query("update  opening set commitStatus =? where studentID = ?", [
      "已提交",
      req.student.userID,
    ]);
    await db.query(
      "delete from opening where id not in (select t.min_id from (select min(id) as min_id from opening group by studentID) as t)"
    );
    res.json({
      success: true,
      code: 200,
      message: "开题报告上传成功",
      type: "single",
    });
  }
);
//获取论文信息
student.get("/graduationInfo/:studentID", async (req, res) => {
  let result = await db.findOne(
    "select * from graduation where studentID = ?",
    [req.params.studentID]
  );
  res.json({
    success: true,
    code: 200,
    message: "获取论文信息成功",
    data: result,
  });
});
//获取开题报告信息
student.get("/openingInfo/:studentID", async (req, res) => {
  let result = await db.findOne("select * from opening where studentID = ?", [
    req.params.studentID,
  ]);
  res.json({
    success: true,
    code: 200,
    message: "获取开题报告信息成功",
    data: result,
  });
});
//获取开题报告信息
student.get("/literatureInfo/:studentID", async (req, res) => {
  let result = await db.findOne(
    "select * from literature where studentID = ?",
    [req.params.studentID]
  );
  res.json({
    success: true,
    code: 200,
    message: "获取文献综述信息成功",
    data: result,
  });
});
module.exports = student;
