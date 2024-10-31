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

  let groupData = reactive({
    //群组列表
    groups: {},
    //当前群信息
    currentGroupId: null
  })

  function exitGroup(currentGroupId) {
    $http.get($constant.baseURL + "/imChatGroupUser/quitGroup", {id: currentGroupId})
      .then((res) => {
        delete groupData.groups[currentGroupId];
        groupData.currentGroupId = null;
        ElMessage({
          message: "退群成功！",
          type: 'success'
        });
      })
      .catch((error) => {
        ElMessage({
          message: error.message,
          type: 'error'
        });
      });
  }

  function dissolveGroup(currentGroupId) {
    $http.get($constant.baseURL + "/imChatGroup/deleteGroup", {id: currentGroupId})
      .then((res) => {
        delete groupData.groups[currentGroupId];
        groupData.currentGroupId = null;
        ElMessage({
          message: "解散群成功！",
          type: 'success'
        });
      })
      .catch((error) => {
        ElMessage({
          message: error.message,
          type: 'error'
        });
      });
  }

  async function getImGroup() {
    await $http.get($constant.baseURL + "/imChatGroup/listGroup")
      .then((res) => {
        if (!$common.isEmpty(res.data)) {
          res.data.forEach(group => {
            groupData.groups[group.id] = group;
          });
        }
      })
      .catch((error) => {
        ElMessage({
          message: error.message,
          type: 'error'
        });
      });
  }

  function addGroupTopic() {
    $http.get($constant.baseURL + "/imChatGroup/addGroupTopic", {id: groupData.currentGroupId})
      .then((res) => {
      })
      .catch((error) => {
        ElMessage({
          message: error.message,
          type: 'error'
        });
      });
  }

  return {
    groupData,
    getImGroup,
    addGroupTopic,
    exitGroup,
    dissolveGroup
  }
}
