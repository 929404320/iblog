// Copyright (c) poetize.cn. All rights reserved.
// 习近平：全面加强知识产权保护工作 激发创新活力推动构建新发展格局
// 项目开源版本使用AGPL v3协议，商业活动除非获得商业授权，否则无论以何种方式修改或者使用代码，都需要开源。地址：https://gitee.com/littledokey/poetize.git
// 开源不等于免费，请尊重作者劳动成果。
// 项目闭源版本及资料禁止任何未获得商业授权的网络传播和商业活动。地址：https://poetize.cn/article/20
// 项目唯一官网：https://poetize.cn

import {useStore} from 'vuex';

import {useDialog} from 'naive-ui';

import {nextTick} from 'vue';

import {ElMessage} from "element-plus";

import {reactive, getCurrentInstance, onMounted, onBeforeUnmount, watchEffect, toRefs} from 'vue';

export default function () {
  const globalProperties = getCurrentInstance().appContext.config.globalProperties;
  const $common = globalProperties.$common;
  const $http = globalProperties.$http;
  const $constant = globalProperties.$constant;
  const store = useStore();
  const dialog = useDialog();

  let imUtilData = reactive({
    //系统消息
    systemMessages: [],
    showBodyLeft: true,
    //表情包
    imageList: []
  })

  onMounted(() => {
    if ($common.mobile()) {
      $(".friend-aside").click(function () {
        imUtilData.showBodyLeft = true;
        mobileRight();
      });

      $(".body-right").click(function () {
        imUtilData.showBodyLeft = false;
        mobileRight();
      });
    }
    mobileRight();
  })

  function changeAside() {
    imUtilData.showBodyLeft = !imUtilData.showBodyLeft;
    mobileRight();
  }

  function mobileRight() {
    if (imUtilData.showBodyLeft && $common.mobile()) {
      $(".body-right").addClass("mobile-right");
    } else if (!imUtilData.showBodyLeft && $common.mobile()) {
      $(".body-right").removeClass("mobile-right");
    }
  }

  function getSystemMessages() {
    $http.get($constant.baseURL + "/imChatUserMessage/listSystemMessage")
      .then((res) => {
        if (!$common.isEmpty(res.data) && !$common.isEmpty(res.data.records)) {
          imUtilData.systemMessages = res.data.records;
        }
      })
      .catch((error) => {
        ElMessage({
          message: error.message,
          type: 'error'
        });
      });
  }

  function hiddenBodyLeft() {
    if ($common.mobile()) {
      $(".body-right").click(function () {
        imUtilData.showBodyLeft = false;
        mobileRight();
      });
    }
  }

  function getImageList() {
    $http.get($constant.baseURL + "/resource/getImageList")
      .then((res) => {
        if (!$common.isEmpty(res.data)) {
          imUtilData.imageList = res.data;
        }
      })
      .catch((error) => {
        ElMessage({
          message: error.message,
          type: 'error'
        });
      });
  }

  function parseMessage(content) {
    content = content.replace(/\n{2,}/g, '<div style="height: 12px"></div>');
    content = content.replace(/\n/g, '<br/>');
    content = $common.faceReg(content);
    content = $common.pictureReg(content);
    return content;
  }

  return {
    imUtilData,
    changeAside,
    mobileRight,
    getSystemMessages,
    hiddenBodyLeft,
    getImageList,
    parseMessage
  }
}
