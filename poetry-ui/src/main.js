// Copyright (c) poetize.cn. All rights reserved.
// 习近平：全面加强知识产权保护工作 激发创新活力推动构建新发展格局
// 项目开源版本使用AGPL v3协议，商业活动除非获得商业授权，否则无论以何种方式修改或者使用代码，都需要开源。地址：https://gitee.com/littledokey/poetize.git
// 开源不等于免费，请尊重作者劳动成果。
// 项目闭源版本及资料禁止任何未获得商业授权的网络传播和商业活动。地址：https://poetize.cn/article/20
// 项目唯一官网：https://poetize.cn

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import http from './utils/request'
import common from './utils/common'
import constant from './utils/constant'
import mavonEditor from 'mavon-editor'
//引入js
//import './utils/live2d'
import './utils/title'
//引入css
import './assets/css/animation.css'
import './assets/css/index.css'
import './assets/css/tocbot.css'
import './assets/css/color.css'
import './assets/css/markdown-highlight.css'
import './assets/css/font-awesome.min.css'
import 'mavon-editor/dist/css/index.css'

import {vueBaberrage} from 'vue-baberrage'

Vue.use(ElementUI)
Vue.use(vueBaberrage)
Vue.use(mavonEditor)

Vue.prototype.$http = http
Vue.prototype.$common = common
Vue.prototype.$constant = constant

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
