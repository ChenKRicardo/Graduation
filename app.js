const express = require("express");
require("express-async-errors");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
app.listen(8080, () => {
  console.log(`服务器开启 http://localhost:8080`);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/uploads")); //服务器端建立uploads文件夹用来接受上传的文件，并将uploads文件夹托管为静态文件
//修改上传文件大小限制
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
//图片加载,存储在uploads下的所有图片
app.get("/uploads/*", function(req, res) {
  res.sendFile(__dirname + "/" + req.url);
});
//配置session
app.use(
  session({
    secret: "This is a secret string",
    name: "Roles",
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 30 * 60,
      httpOnly: false,
      secure: false,
    },
  })
);
//跨域
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
//导入路由
const studentRouter = require("./routes/student");
const teacherRouter = require("./routes/teacher");
const adminRouter = require("./routes/admin");
//使用路由
//管理员
app.post("/adminRegister", adminRouter);
app.post("/admin/login", adminRouter);
app.get("/getAdminInfo", adminRouter);
app.get("/admin/logout", adminRouter);
app.get("/adminSearchAllScore/:page/:limit", adminRouter);
app.get("/statisticsOpeningInfo/:page/:limit", adminRouter);
app.get("/statisticsLiteratureInfo/:page/:limit", adminRouter);
app.get("/statisticsGraduationInfo/:page/:limit", adminRouter);

//学生
app.post("/studentRegister", studentRouter);
app.post("/student/login", studentRouter);
app.get("/getStudentInfo", studentRouter);
app.get("/student/logout", studentRouter);
app.get("/searchTpoic/:tpoicName", studentRouter);
app.put("/editStudentInfo", studentRouter);
app.get("/studentSearchAllTpoic/:page/:limit", studentRouter);
app.get("/studentSearchScore/:studentID", studentRouter);
app.post("/student/graduationUpload", studentRouter);
app.post("/student/literatureUpload", studentRouter);
app.post("/student/openingUpload", studentRouter);
app.get("/chooseTpoic/:tpoicid", studentRouter);
app.get("cancleTpoic/:tpoicid", studentRouter);
app.get("/graduationInfo/:studentID", studentRouter);
app.get("/openingInfo/:studentID", studentRouter);
app.get("/literatureInfo/:studentID", studentRouter);

//教师
app.post("/teacherRegister", teacherRouter);
app.post("/teacher/login", teacherRouter);
app.get("/getTeacherInfo", teacherRouter);
app.get("/teacher/logout", teacherRouter);
app.post("/teacher/createTpoic", teacherRouter);
app.delete("/deleteTpoic/:tpoicId", teacherRouter);
app.put("/editTeacherInfo", teacherRouter);
app.put("/editTpoic/:tpoicId", teacherRouter);
app.get("/teacherSearchAllScore/:page/:limit", teacherRouter);
app.post("/createScore/:studentId", teacherRouter);
app.put("/editScore/:studentId", teacherRouter);
app.put("/auditGraduation/:studentID", teacherRouter);
app.put("/uploadGraduation/:studentID", teacherRouter);
app.get("/teacherSearchGraduation/:page/:limit", teacherRouter);
app.put("/auditOpening/:studentID", teacherRouter);
app.put("/uploadOpening/:studentID", teacherRouter);
app.get("/teacherSearchOpening/:page/:limit", teacherRouter);
app.put("/auditLiterature/:studentID", teacherRouter);
app.put("/uploadLiterature/:studentID", teacherRouter);
app.get("/teacherSearchLiterature/:page/:limit", teacherRouter);




app.use("/", studentRouter);
app.use("/", teacherRouter);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    success: false,
    message: err.message,
  });
});
