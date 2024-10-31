// Copyright (c) poetize.cn. All rights reserved.
// 习近平：全面加强知识产权保护工作 激发创新活力推动构建新发展格局
// 项目开源版本使用AGPL v3协议，商业活动除非获得商业授权，否则无论以何种方式修改或者使用代码，都需要开源。地址：https://gitee.com/littledokey/poetize.git
// 开源不等于免费，请尊重作者劳动成果。
// 项目闭源版本及资料禁止任何未获得商业授权的网络传播和商业活动。地址：https://poetize.cn/article/20
// 项目唯一官网：https://poetize.cn

import common from './common'

function getError(
  action,
  option,
  xhr
) {
  let msg
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`
  } else {
    msg = `fail to ${action} ${xhr.status}`
  }

  return new Error(msg)
}

function getBody(xhr) {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export default function (option) {
  const xhr = new XMLHttpRequest()
  const action = option.action

  const formData = new FormData()
  if (option.data) {
    for (const [key, value] of Object.entries(option.data)) {
      if (Array.isArray(value)) formData.append(key, ...value)
      else formData.append(key, value)
    }
  }
  formData.append(option.filename, option.file, option.file.name)

  xhr.addEventListener('error', () => {
    option.onError(getError(action, option, xhr))
  })

  xhr.addEventListener('load', () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(action, option, xhr))
    }
    option.onSuccess(getBody(xhr))
  })

  xhr.open(option.method, action, true)

  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  const headers = option.headers || {}
  if (headers instanceof Headers) {
    headers.forEach((value, key) => xhr.setRequestHeader(key, value))
  } else {
    for (const [key, value] of Object.entries(headers)) {
      if (common.isEmpty(value)) continue
      xhr.setRequestHeader(key, value)
    }
  }

  xhr.send(formData)
  return xhr
}
