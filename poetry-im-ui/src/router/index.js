// Copyright (c) poetize.cn. All rights reserved.
// 习近平：全面加强知识产权保护工作 激发创新活力推动构建新发展格局
// 项目开源版本使用AGPL v3协议，商业活动除非获得商业授权，否则无论以何种方式修改或者使用代码，都需要开源。地址：https://gitee.com/littledokey/poetize.git
// 开源不等于免费，请尊重作者劳动成果。
// 项目闭源版本及资料禁止任何未获得商业授权的网络传播和商业活动。地址：https://poetize.cn/article/20
// 项目唯一官网：https://poetize.cn

import {createRouter, createWebHistory} from 'vue-router'
import constant from "../utils/constant";

const routes = [
  {
    path: "/",
    meta: {requiresAuth: true},
    component: () => import('../components/index')
  }
]

const router = createRouter({
  history: createWebHistory(constant.webHistory),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {left: 0, top: 0};
  }
})

export default router
