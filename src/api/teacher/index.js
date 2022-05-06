import request from "@/utils/request";

//教师登录
export const reqTeacherLogin = (data) =>
  request({
    url: "/teacher/login",
    method: "POST",
    data,
  });

//获取教师信息
export const reqGetTeacherInfo = (token) =>
  request({
    url: "/getTeacherInfo",
    method: "get",
    params: { token },
  });

//教师退出登录
export const reqTeacherLogOut = () => request.get("/teacher/logout");

//教师注册
export const reqTeacherRegister = (data) =>
  request({
    url: "/teacherRegister",
    method: "post",
    data,
  });

//教师修改信息
export const reqUpdateTeacherInfo = (data) =>
  request({
    url: "/editTeacherInfo",
    method: "put",
    data,
  });

//教师创建OR修改选题
export const reqAddOrUpdateTpoic = (tpoic) => {
  if (tpoic.id) {
    return request({
      url: `/editTpoic/${tpoic.id}`,
      method: "put",
      data: tpoic,
    });
  } else {
    return request({
      url: "teacher/createTpoic",
      method: "post",
      data: tpoic,
    });
  }
};

//教师删除选题
export const reqDeleteTpoic = (tpoicId) =>
  request.delete(`/deleteTpoic/${tpoicId}`);

//分页查询学生成绩信息
export const reqGetStudentScoreInfo = (page, limit) =>
  request.get(`/teacherSearchAllScore/${page}/${limit}`);

//教师创建学生成绩
export const reqCreateStudentScore = (studentId, data) =>
  request({
    url: `/createScore/${studentId}`,
    method: "post",
    data,
  });
request.post();
//教师修改学生成绩
export const reqUpdateStudentScore = (studentId, data) =>
  request({
    url: `/editScore/${studentId}`,
    method: "put",
    data,
  });

//教师查询学生论文信息
export const reqGetStudentGraduationInfo = (page, limit) =>
  request.get(`/teacherSearchGraduation/${page}/${limit}`);

//上传论文审核意见
export const reqPostGraduationAdvice = (studentID, data) =>
  request({
    url: `/auditGraduation/${studentID}`,
    method: "POST",
    data,
  });

//修改论文审核意见
export const reqUploadGraduationAdvice = (studentID, data) =>
  request({
    url: `/uploadGraduation/${studentID}`,
    method: "PUT",
    data,
  });

//教师查询学生开题报告信息
export const reqGetStudentOpeningInfo = (page, limit) =>
request.get(`/teacherSearchOpening/${page}/${limit}`);

//上传开题报告审核意见
export const reqPostOpeningAdvice = (studentID, data) =>
request({
  url: `/auditOpening/${studentID}`,
  method: "POST",
  data,
});

//修改开题报告审核意见
export const reqUploadOpeningAdvice = (studentID, data) =>
request({
  url: `/uploadOpening/${studentID}`,
  method: "PUT",
  data,
});

//教师查询学生文献综述信息
export const reqGetStudentLiteratureInfo = (page, limit) =>
request.get(`/teacherSearchLiterature/${page}/${limit}`);

//上传开题报告审核意见
export const reqPostLiteratureAdvice = (studentID, data) =>
request({
  url: `/auditLiterature/${studentID}`,
  method: "POST",
  data,
});

//修改开题报告审核意见
export const reqUploadLiteratureAdvice = (studentID, data) =>
request({
  url: `/uploadLiterature/${studentID}`,
  method: "PUT",
  data,
});
