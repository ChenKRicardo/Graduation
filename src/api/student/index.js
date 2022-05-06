import request from "@/utils/request";

//学生登录
export const reqStudentLogin = (data) =>
  request({
    url: "/student/login",
    method: "POST",
    data,
  });

//获取学生信息
export const reqGetStudentInfo = (token) =>
  request({
    url: "/getStudentInfo",
    method: "get",
    params: { token },
  });

//学生退出登录
export const reqStudentLogOut = () => request.get("/student/logout");

//学生注册
export const reqStudentRegister = (data) =>
  request({
    url: "/studentRegister",
    method: "post",
    data,
  });

//修改学生信息
export const reqUpdateStudentInfo = (data)=>
  request({
    url:"/editStudentInfo",
    method:"put",
    data
  })

//学生查看成绩
export const reqViewScore =(studentID)=>request.get(`/studentSearchScore/${studentID}`)

//学生搜索选题
export const reqSearchTpoic = (tpoicName) =>request.get(`/searchTpoic/${tpoicName}`)

//学生分页查询选题
export const reqGetAllTpoic = (page,limit) => request.get(`studentSearchAllTpoic/${page}/${limit}`)

//学生勾选选题
export const reqChooseTpoic = (tpoicid) =>request.get(`/chooseTpoic/${tpoicid}`)

//学生取消勾选
export const reqCancleTpoic = (tpoicid) =>request.get(`/cancleTpoic/${tpoicid}`)

//学生上传论文
export const reqUploadGraduation = ()=>request.post("/student/graduationUpload")

//学生上传开题报告
export const reqUploadOpening = ()=>request.post("/student/openingUpload")

//学生上传文献综述
export const reqUploadLiterature = ()=>request.post("/student/literatureUpload")

//学生获取论文
export const reqGetGraduationInfo = (studentID)=>request.get(`/graduationInfo/${studentID}`)

//学生获取开题报告
export const reqGetOpeningInfo = (studentID)=>request.get(`/openingInfo/${studentID}`)

//学生获取文献综述
export const reqGetLiteratureInfo = (studentID)=>request.get(`/literatureInfo/${studentID}`)
