//表单验证
const { body, param, query, validationResult } = require("express-validator");
const match = require("nodemon/lib/monitor/match");
const validators = {
  studentName: body("studentName")
    .trim()
    .notEmpty()
    .withMessage("姓名不能为空"),
  teacherName: body("teacherName")
    .trim()
    .notEmpty()
    .withMessage("姓名不能为空"),
  userID: body("userID")
    .trim()
    .notEmpty()
    .withMessage("请输入用户ID"),
    studentID: body("studentID")
    .trim()
    .notEmpty()
    .withMessage("请输入用户ID"),
  password: body("password")
    .trim()
    .isLength({
      min: 6,
      max: 12,
    })
    .withMessage("密码长度必须在6-10位"),
  confirmPassword: body("confirmPassword")
    .trim()
    .isLength({
      min: 6,
      max: 12,
    })
    .withMessage("密码长度必须在6-10位")
    .custom((val, { req }) => {
      if (val != req.body.password) throw new Error("两次密码输入必须一致");
      return true;
    }),
  newPassword: body("newPassword")
    .trim()
    .isLength({
      min: 6,
      max: 12,
    })
    .withMessage(`密码长度必须在6-10位`),
  confirmNewPassword: body("confirmNewPassword")
    .trim()
    .isLength({
      min: 6,
      max: 12,
    })
    .withMessage("密码长度在6到20个之间")
    .custom((val, { req }) => {
      if (val != req.body.newPassword) throw new Error("两次密码输入必须一致");
      return true;
    }),
  academy: body("academy")
    .trim()
    .notEmpty()
    .withMessage("请输入学院信息"),
  specialized: body("specialized")
    .trim()
    .notEmpty()
    .withMessage("请输入本专业"),
  Degree: body("Degree")
    .trim()
    .notEmpty()
    .withMessage("请输入学历"),
  jobTitle: body("jobTitle")
    .trim()
    .notEmpty()
    .withMessage("请输入职称"),
  phone: body("phone")
    .trim()
    .notEmpty()
    .withMessage("请输入手机号"),
  mailbox: body("mailbox")
    .trim()
    .notEmpty()
    .withMessage("邮箱地址不能为空"),
  title: body("title")
    .trim()
    .notEmpty()
    .withMessage("题目不能为空"),
  openingTeacher: body("openingTeacher")
    .trim()
    .notEmpty()
    .withMessage("开题教师不能为空"),
  specialized: body("specialized")
    .trim()
    .notEmpty()
    .withMessage("题目所属专业不能为空"),
  graduateScore: body("graduateScore")
    .trim()
    .notEmpty()
    .matches("^[0-9]*$")
    .withMessage("论文成绩必须为数字"),
  deviseScore: body("graduateScore")
    .trim()
    .notEmpty()
    .matches("^[0-9]*$")
    .withMessage("毕设成绩必须为数字"),
  ReplyScore: body("graduateScore")
    .trim()
    .notEmpty()
    .matches("^[0-9]*$")
    .withMessage("答辩成绩必须为数字"),
  totalScore: body("graduateScore")
    .trim()
    .notEmpty()
    .matches("^[0-9]*$")
    .withMessage("成绩总分必须为数字"),
  limit: query("limit")
    .optional()
    .toInt(),
  page: query("page")
    .optional()
    .toInt(),
};
const validate = (validators) => {
  return async (req, res, next) => {
    await Promise.all(validators.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    let err = {};
    for (let e of errors.array()) {
      if (e.param in err) err[e.param].push(e.msg);
      else err[e.param] = [e.msg];
    }
    res.json({
      success: false,
      errors: err,
    });
  };
};
module.exports = {
  validators,
  validate,
};
