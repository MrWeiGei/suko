import axios from 'axios'

import qs from 'qs';
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'

import router from '@/router'

import {
  getToken
} from '@/utils/auth'

// 创建一个axios实例
const service = axios.create({
  baseURL: '/suko', // url = base url + request url
  withCredentials: true, // 当跨域请求时发送cookie
  timeout: 15000 // 请求超时时间
})

// 请求拦截器

service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么

    // if (store.getters.token) {
    //   // 让每个请求携带令牌——['X-Token']作为自定义密钥。
    //   // 请根据实际情况修改。
    //   config.headers['X-Token'] = getToken()
    // }
    if (config.json) {
      config.headers['Content-Type'] = 'application/json'
    } else {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
      config.data = qs.stringify(config.data);
    }

    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // 调试
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    console.log(res)

    // 如果自定义代码不是200，则判断为错误。
    if (res.code == 200 || res.code == 300) {
      // 重新登陆
      MessageBox.confirm('您的登录状态存在问题，您可以取消以停留在此页面，或再次登录', '系统提示', {
        confirmButtonText: '重新登录',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload();
        })
      })
      return
    } else {
      if (res.code == 700) {
        Message.warning('您没有获取请求的权限！')
        router.replace({
          path: '/401'
        })
        return
      } else {
        return res
      }
    }
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
