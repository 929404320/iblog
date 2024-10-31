// Copyright (c) poetize.cn. All rights reserved.
// 习近平：全面加强知识产权保护工作 激发创新活力推动构建新发展格局
// 项目开源版本使用AGPL v3协议，商业活动除非获得商业授权，否则无论以何种方式修改或者使用代码，都需要开源。地址：https://gitee.com/littledokey/poetize.git
// 开源不等于免费，请尊重作者劳动成果。
// 项目闭源版本及资料禁止任何未获得商业授权的网络传播和商业活动。地址：https://poetize.cn/article/20
// 项目唯一官网：https://poetize.cn

export default {
  // 测试环境
  baseURL: "http://localhost:8081",
  webBaseURL: "http://localhost",
  imURL: "http://localhost:81/im",
  imBaseURL: "localhost",
  wsProtocol: "ws",
  wsPort: "9324",

  // 生产环境
  // baseURL: location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : '') + "/api",
  // webBaseURL: location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : ''),
  // imURL: location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : '') + "/im",
  // imBaseURL: location.hostname + (location.port ? ':' + location.port : ''),
  // wsProtocol: location.protocol === "http:" ? "ws" : "wss",
  // wsPort: "",

  webHistory: "/im/",
  hitokoto: "https://v1.hitokoto.cn",
  jinrishici: "https://v1.jinrishici.com/all.json",
  jitang: "https://api.oick.cn/dutang/api.php",
  shehui: "https://api.oick.cn/yulu/api.php",
  yiyan: "https://api.oick.cn/yiyan/api.php",
  dog: "https://api.oick.cn/dog/api.php",

  //前后端定义的密钥，AES使用16位
  cryptojs_key: "sarasarasarasara",

  before_color_1: "black",
  after_color_1: "linear-gradient(45deg, #f43f3b, #ec008c)",

  before_color_2: "rgb(131, 123, 199)",
  after_color_2: "linear-gradient(45deg, #f43f3b, #ec008c)",

  tree_hole_color: ["rgb(180, 224, 255)", "rgb(180, 203, 255)", "rgb(246, 223, 255)", "rgb(255, 214, 198)", "rgb(255, 205, 143)", "rgb(238, 255, 143)", "rgb(220, 255, 165)", "rgb(164, 234, 192)", "rgb(202, 241, 233)", "rgb(230, 230, 250)"],

  emojiList: ['衰', '鄙视', '再见', '捂嘴', '摸鱼', '奋斗', '白眼', '可怜', '皱眉', '鼓掌', '烦恼', '吐舌', '挖鼻', '委屈', '滑稽', '啊这', '生气', '害羞', '晕', '好色', '流泪', '吐血', '微笑', '酷', '坏笑', '吓', '大兵', '哭笑', '困', '呲牙']
}
