// Copyright (c) poetize.cn. All rights reserved.
// 习近平：全面加强知识产权保护工作 激发创新活力推动构建新发展格局
// 项目开源版本使用AGPL v3协议，商业活动除非获得商业授权，否则无论以何种方式修改或者使用代码，都需要开源。地址：https://gitee.com/littledokey/poetize.git
// 开源不等于免费，请尊重作者劳动成果。
// 项目闭源版本及资料禁止任何未获得商业授权的网络传播和商业活动。地址：https://poetize.cn/article/20
// 项目唯一官网：https://poetize.cn

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toolbar: JSON.parse(localStorage.getItem("toolbar") || '{"visible": false, "enter": true}'),
    sortInfo: JSON.parse(localStorage.getItem("sortInfo") || '[]'),
    currentUser: JSON.parse(localStorage.getItem("currentUser") || '{}'),
    currentAdmin: JSON.parse(localStorage.getItem("currentAdmin") || '{}'),
    sysConfig: JSON.parse(localStorage.getItem("sysConfig") || '{}'),
    webInfo: JSON.parse(localStorage.getItem("webInfo") || '{"webName": "", "webTitle": [], "notices": [], "randomCover": [], "footer": "", "backgroundImage": "", "avatar": ""}')
  },
  getters: {
    articleTotal: state => {
      if (state.sortInfo !== null && state.sortInfo.length !== 0) {
        if (state.sortInfo.length === 1) {
          return state.sortInfo[0].countOfSort;
        } else {
          return state.sortInfo.reduce((prev, curr) => {
            if (typeof prev === "number") {
              return prev + curr.countOfSort;
            } else {
              return prev.countOfSort + curr.countOfSort;
            }
          });
        }
      } else {
        return 0;
      }
    },
    navigationBar: state => {
      if (state.sortInfo !== null && state.sortInfo.length !== 0) {
        return state.sortInfo.filter(f => f.sortType === 0);
      } else {
        return [];
      }
    }
  },
  mutations: {
    changeToolbarStatus(state, toolbarState) {
      state.toolbar = toolbarState;
      localStorage.setItem("toolbar", JSON.stringify(toolbarState));
    },
    loadSortInfo(state, sortInfo) {
      if (sortInfo !== null && sortInfo.length !== 0) {
        state.sortInfo = sortInfo.sort((s1, s2) => s1.priority - s2.priority);
        localStorage.setItem("sortInfo", JSON.stringify(sortInfo.sort((s1, s2) => s1.priority - s2.priority)));
      }
    },
    loadCurrentUser(state, user) {
      state.currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(user));
    },
    loadSysConfig(state, sysConfig) {
      state.sysConfig = sysConfig;
      localStorage.setItem("sysConfig", JSON.stringify(sysConfig));
    },
    loadCurrentAdmin(state, user) {
      state.currentAdmin = user;
      localStorage.setItem("currentAdmin", JSON.stringify(user));
    },
    loadWebInfo(state, webInfo) {
      webInfo.webTitle = webInfo.webTitle.split('');
      webInfo.notices = JSON.parse(webInfo.notices);
      webInfo.randomCover = JSON.parse(webInfo.randomCover);
      state.webInfo = webInfo;
      localStorage.setItem("webInfo", JSON.stringify(webInfo));
    }
  },
  actions: {},
  modules: {},
  plugins: []
})
