import {
  reqStudentLogin,
  reqGetStudentInfo,
  reqStudentLogOut,
} from "@/api/student";
import {
  reqTeacherLogin,
  reqGetTeacherInfo,
  reqTeacherLogOut,
} from "@/api/teacher";
import { constantRoutes, asyncRoutes, anyRoutes } from "@/router";
import { reqAdminLogin, reqGetAdminInfo, reqAdminLogOut } from "@/api/admin";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";
import router from "@/router";
const getDefaultState = () => {
  return {
    token: getToken(),
    roles: "",
    loginRoles: "",
    ignoreMessage:"",
    //对比之后，(项目中已有的异步路由，与服务器返回的标记信息对比最终要展示的路由)
    resultAsyncRoutes: [],
    //当前用户所呈现的完整路由
    resultAllRoutes: [],
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_LOGINROLES: (state, loginRoles) => {
    state.loginRoles = loginRoles;
  },
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes;
    state.resultAllRoutes = constantRoutes.concat(
      state.resultAsyncRoutes,
      anyRoutes
    );
    router.addRoutes(state.resultAllRoutes);
  },
};
const computedAsyncRoutes = (asyncRoutes, roles) => {
  return asyncRoutes.filter((item) => {
    if (item.meta.roles.indexOf(roles) != -1) {
      if (item.children && item.children.length > 0) {
        item.children = computedAsyncRoutes(item.children, roles);
      }
      return true;
    }
  });
};
const actions = {
  // user login
  async login({ commit }, userInfo) {
    commit("SET_LOGINROLES", userInfo.roles);
    localStorage.setItem("loginRoles", userInfo.roles);
    if (userInfo.roles == "student") {
      let result = await reqStudentLogin(userInfo);
      const { data } = result;
      if (result.code === 200) {
        commit("SET_TOKEN", data.token);
        setToken(data.token);
        return "OK";
      } else {
        return Promise.reject(new Error(result.message));
      }
    } else {
      if (userInfo.roles == "teacher") {
        let result = await reqTeacherLogin(userInfo);
        commit("SET_LOGINROLES", userInfo.roles);
        localStorage.setItem("loginRoles", userInfo.roles);
        const { data } = result;
        if (result.code === 200) {
          commit("SET_TOKEN", data.token);
          setToken(data.token);
          return "OK";
        } else {
          return Promise.reject(new Error(result.message));
        }
      } else {
        let result = await reqAdminLogin(userInfo);
        const { data } = result;
        if (result.code === 200) {
          commit("SET_TOKEN", data.token);
          setToken(data.token);
          return "OK";
        } else {
          return Promise.reject(new Error(result.message));
        }
      }
    }
  },

  // get user info
  async getInfo({ commit, state }) {
    if (localStorage.getItem("loginRoles") == "student") {
      let result = await reqGetStudentInfo(state.token);
      const { data } = result;
      if (!data) {
        return Promise.reject("Verification failed, please Login again.");
      }
      if (result.code == 200) {
        commit("SET_ROLES", data.roles);
        commit(
          "SET_RESULTASYNCROUTES",
          computedAsyncRoutes(asyncRoutes, data.roles)
        );
        return "OK";
      } else {
        return Promise.reject(new Error(result.message));
      }
    } else {
      if (localStorage.getItem("loginRoles") == "teacher") {
        let result = await reqGetTeacherInfo(state.token);
        const { data } = result;
        if (!data) {
          return Promise.reject("Verification failed, please Login again.");
        }
        if (result.code == 200) {
          commit("SET_ROLES", data.roles);
          commit(
            "SET_RESULTASYNCROUTES",
            computedAsyncRoutes(asyncRoutes, data.roles)
          );
          return "OK";
        } else {
          return Promise.reject(new Error(result.message));
        }
      } else {
        let result = await reqGetAdminInfo(state.token);
        const { data } = result;
        if (!data) {
          return Promise.reject("Verification failed, please Login again.");
        }
        if (result.code == 200) {
          commit("SET_ROLES", data.roles);
          commit(
            "SET_RESULTASYNCROUTES",
            computedAsyncRoutes(asyncRoutes, data.roles)
          );
          return "OK";
        } else {
          return Promise.reject(new Error(result.message));
        }
      }
    }
  },

  // // user logout
  async logout({ commit, state }) {
    if (state.loginRoles == "student") {
      let result = await reqStudentLogOut(state.token);
      if (result.code == 200) {
        removeToken();
        resetRouter();
        commit("RESET_STATE");
        localStorage.removeItem("loginRoles");
      } else {
        return Promise.reject(new Error(result.message));
      }
    } else {
      if (state.loginRoles == "teacher") {
        let result = await reqTeacherLogOut(state.token);
        if (result.code == 200) {
          removeToken();
          resetRouter();
          commit("RESET_STATE");
          localStorage.removeItem("loginRoles");
        } else {
          return Promise.reject(new Error(result.message));
        }
      } else {
        let result = await reqAdminLogOut(state.token);
        if (result.code == 200) {
          removeToken();
          resetRouter();
          commit("RESET_STATE");
          localStorage.removeItem("loginRoles");
        } else {
          return Promise.reject(new Error(result.message));
        }
      }
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
