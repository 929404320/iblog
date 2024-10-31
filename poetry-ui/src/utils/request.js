// Copyright (c) poetize.cn. All rights reserved.
// 习近平：全面加强知识产权保护工作 激发创新活力推动构建新发展格局
// 项目开源版本使用AGPL v3协议，商业活动除非获得商业授权，否则无论以何种方式修改或者使用代码，都需要开源。地址：https://gitee.com/littledokey/poetize.git
// 开源不等于免费，请尊重作者劳动成果。
// 项目闭源版本及资料禁止任何未获得商业授权的网络传播和商业活动。地址：https://poetize.cn/article/20
// 项目唯一官网：https://poetize.cn

import axios from "axios";
import constant from "./constant";
//处理url参数
import qs from "qs";

import store from "../store";


axios.defaults.baseURL = constant.baseURL;


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.data !== null && response.data.hasOwnProperty("code") && response.data.code !== 200) {
    if (response.data.code === 300) {
      store.commit("loadCurrentUser", {});
      localStorage.removeItem("userToken");
      store.commit("loadCurrentAdmin", {});
      localStorage.removeItem("adminToken");
      window.location.href = constant.webURL + "/user";
    }
    return Promise.reject(new Error(response.data.message));
  } else {
    return response;
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

// 当data为URLSearchParams对象时设置为application/x-www-form-urlencoded;charset=utf-8
// 当data为普通对象时，会被设置为application/json;charset=utf-8


export default {
  post(url, params = {}, isAdmin = false, json = true) {
    let config;
    if (isAdmin) {
      config = {
        headers: {"Authorization": localStorage.getItem("adminToken")}
      };
    } else {
      config = {
        headers: {"Authorization": localStorage.getItem("userToken")}
      };
    }

    return new Promise((resolve, reject) => {
      axios
        .post(url, json ? params : qs.stringify(params), config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  get(url, params = {}, isAdmin = false) {
    let headers;
    if (isAdmin) {
      headers = {"Authorization": localStorage.getItem("adminToken")};
    } else {
      headers = {"Authorization": localStorage.getItem("userToken")};
    }

    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params,
        headers: headers
      }).then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err)
      })
    });
  },

  upload(url, param, isAdmin = false, option) {
    let config;
    if (isAdmin) {
      config = {
        headers: {"Authorization": localStorage.getItem("adminToken"), "Content-Type": "multipart/form-data"},
        timeout: 60000
      };
    } else {
      config = {
        headers: {"Authorization": localStorage.getItem("userToken"), "Content-Type": "multipart/form-data"},
        timeout: 60000
      };
    }
    if (typeof option !== "undefined") {
      config.onUploadProgress = progressEvent => {
        if (progressEvent.total > 0) {
          progressEvent.percent = progressEvent.loaded / progressEvent.total * 100;
        }
        option.onProgress(progressEvent);
      };
    }

    return new Promise((resolve, reject) => {
      axios
        .post(url, param, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  uploadQiniu(url, param) {
    let config = {
      headers: {"Content-Type": "multipart/form-data"},
      timeout: 60000
    };

    return new Promise((resolve, reject) => {
      axios
        .post(url, param, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
