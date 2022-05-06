import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

export const constantRoutes = [
  //登录
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  //学生注册
  {
    path: "/studentRegister",
    component: () => import("@/views/register/student"),
  },
  //教师注册
  {
    path: "/teacherRegister",
    component: () => import("@/views/register/teacher"),
  },
  //404
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
];

export const asyncRoutes = [
  //管理员功能
  //首页
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    meta: { roles: "admin" },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/admin/dashboard/index"),
        meta: {
          title: "首页",
          icon: "el-icon-s-home",
          roles: "admin",
        },
      },
    ],
  },
  //账号管理
  {
    path: "/Acount",
    name: "Acount",
    component: Layout,
    meta: {
      title: "账号管理",
      icon: "el-icon-s-custom",
      roles: "admin",
    },
    children: [
      {
        path: "teacher",
        name: "Teacher",
        meta: {
          title: "教师账号",
          roles: "admin",
        },
        component: () => import("@/views/admin/Account/Teacher"),
      },
      {
        path: "student",
        name: "Student",
        meta: {
          title: "学生账号",
          roles: "admin",
        },
        component: () => import("@/views/admin/Account/Student"),
      },
    ],
  },
  //选题管理
  {
    path: "/selection",
    component: Layout,
    redirect: "/selection",
    meta: { roles: "admin" },
    children: [
      {
        path: "selection",
        name: "Selection",
        component: () => import("@/views/admin/Selection"),
        meta: {
          title: "选题管理",
          icon: "el-icon-document",
          roles: "admin",
        },
      },
    ],
  },
  //过程文档管理
  {
    path: "/doucment",
    redirect: "/doucment/openingReport",
    component: Layout,
    meta: {
      title: "过程文档管理",
      icon: "el-icon-s-order",
      roles: "admin",
    },
    children: [
      {
        path: "openingReport",
        name: "OpeningReport",
        component: () => import("@/views/admin/Document/openingReport"),
        meta: {
          title: "开题报告",
          roles: "admin",
        },
      },
      {
        path: "literatureReview",
        name: "LiteratureReview",
        component: () => import("@/views/admin/Document/literatureReview"),
        meta: {
          title: "文献综述",
          roles: "admin",
        },
      },
      {
        path: "graduationThesis",
        name: "GraduationThesis",
        component: () => import("@/views/admin/Document/graduationThesis"),
        meta: {
          title: "毕业论文",
          roles: "admin",
        },
      },
    ],
  },
  //毕设答辩分组
  {
    path: "/replay",
    redirect: "/replay",
    component: Layout,
    meta: { roles: "admin" },
    children: [
      {
        path: "replay",
        name: "Reply",
        component: () => import("@/views/admin/Replay"),
        meta: {
          title: "毕设答辩",
          icon: "el-icon-chat-round",
          roles: "admin",
        },
      },
    ],
  },
  //成绩管理
  {
    path: "/grade",
    component: Layout,
    meta: { roles: "admin" },
    children: [
      {
        path: "score",
        name: "Score",
        component: () => import("@/views/admin/Grade"),
        meta: {
          title: "成绩管理",
          icon: "el-icon-document-checked",
          roles: "admin",
        },
      },
    ],
  },
  //学生功能
  //学生个人信息
  {
    path: "/",
    component: Layout,
    redirect:"/studentInfo",
    meta: { roles: "student" },
    children: [
      {
        path: "studentInfo",
        name: "StudentInfo",
        meta: { title: "个人信息", icon: "el-icon-user", roles: "student" },
        component: () => import("@/views/student/StudentInfo"),
      },
    ],
  },
  //学生选题
  {
    path: "/studentTopic",
    component: Layout,
    meta: { roles: "student" },
    children: [
      {
        path: "chooseTopic",
        name: "ChooseTopic",
        meta: { title: "选题", icon: "el-icon-reading", roles: "student" },
        component: () => import("@/views/student/ChooseTopic"),
      },
    ],
  },
  //过程文档上传
  {
    path: "/studentDocument",
    redirect: "/studentDocument/openingPromotion",
    component: Layout,
    meta: {
      title: "过程文档上传",
      icon: "el-icon-s-promotion",
      roles: "student",
    },
    children: [
      {
        path: "openingPromotion",
        name: "OpeningPromotion",
        component: () => import("@/views/student/Document/openingPromotion"),
        meta: {
          title: "开题报告上传",
          roles: "student",
        },
      },
      {
        path: "literaturePromotion",
        name: "LiteraturePromotion",
        component: () => import("@/views/student/Document/literaturePromotion"),
        meta: {
          title: "文献综述上传",
          roles: "student",
        },
      },
      {
        path: "graduationPromotion",
        name: "GraduationPromotion",
        component: () => import("@/views/student/Document/graduationPromotion"),
        meta: {
          title: "毕业论文上传",
          roles: "student",
        },
      },
    ],
  },
  //学生成绩查看
  {
    path: "/studentScore",
    component: Layout,
    meta: { roles: "student" },
    children: [
      {
        path: "viewGrades",
        name: "ViewGrades",
        meta: { title: "查看成绩", icon: "el-icon-view", roles: "student" },
        component: () => import("@/views/student/ViewGrades"),
      },
    ],
  },
  // //教师功能
  // //教师个人信息
  {
    path: "/",
    component: Layout,
    redirect:"/teacherInfo",
    meta: { roles: "teacher" },
    children: [
      {
        path: "teacherInfo",
        name: "TeacherInfo",
        meta: { title: "个人信息", icon: "el-icon-user", roles: "teacher" },
        component: () => import("@/views/teacher/TeacherInfo"),
      },
    ],
  },
  //创建选题
  {
    path: "/createTopic",
    component: Layout,
    meta: { roles: "teacher" },
    children: [
      {
        path: "topic",
        name: "Topic",
        meta: {
          title: "创建选题",
          icon: "el-icon-document-add",
          roles: "teacher",
        },
        component: () => import("@/views/teacher/CreateTopic"),
      },
    ],
  },
  //过程文档审阅
  {
    path: "/teacherDocument",
    redirect: "/teacherDocument/openingReview",
    component: Layout,
    meta: {
      title: "过程文档审阅",
      icon: "el-icon-edit-outline",
      roles: "teacher",
    },
    children: [
      {
        path: "openingReview",
        name: "OpeningReview",
        component: () => import("@/views/teacher/Document/openingReview"),
        meta: {
          title: "开题报告审阅",
          roles: "teacher",
        },
      },
      {
        path: "literatureReview",
        name: "LiteratureReview",
        component: () => import("@/views/teacher/Document/literatureReview"),
        meta: {
          title: "文献综述审阅",
          roles: "teacher",
        },
      },
      {
        path: "graduationReview",
        name: "GraduationReview",
        component: () => import("@/views/teacher/Document/graduationReview"),
        meta: {
          title: "毕业论文审阅",
          roles: "teacher",
        },
      },
    ],
  },
  //成绩上传
  {
    path: "/uploadScore",
    component: Layout,
    meta: { roles: "teacher" },
    children: [
      {
        path: "score",
        name: "Score",
        meta: { title: "成绩上传", icon: "el-icon-upload", roles: "teacher" },
        component: () => import("@/views/teacher/uploadScore"),
      },
    ],
  },
];

export const anyRoutes = [
  // 404 page must be placed at the end !!!
  {
    path: "*",
    redirect: "/404",
    hidden: true,
  },
];
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
