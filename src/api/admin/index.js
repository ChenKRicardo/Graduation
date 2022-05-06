import request from "@/utils/request";

//管理员登录
export const reqAdminLogin = (data) =>
  request({
    url: "/admin/login",
    method: "POST",
    data,
  });

//获取管理员信息
export const reqGetAdminInfo = (token) =>
  request({
    url: "/getAdminInfo",
    method: "get",
    params: { token },
  });

//管理员退出登录
export const reqAdminLogOut = () => request.get("/admin/logout");

//管理员统计学生信息
export const reqGetStudentScoreInfo = (page,limit) =>request.get(`/adminSearchAllScore/${page}/${limit}`)

//统计学生论文信息
export const reqStatisticsGraduationInfo = (page,limit) =>request.get(`/statisticsGraduationInfo/${page}/${limit}`)

//统计学生论文信息
export const reqStatisticsOpeningInfo = (page,limit) =>request.get(`/statisticsOpeningInfo/${page}/${limit}`)

//统计学生论文信息
export const reqStatisticsLiteratureInfo = (page,limit) =>request.get(`/statisticsLiteratureInfo/${page}/${limit}`)