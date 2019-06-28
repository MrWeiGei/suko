import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // 进度指示器
import 'nprogress/nprogress.css' // 进度指示器样式
import {
  getToken
} from '@/utils/auth' // 从cookie中获取token
import getPageTitle from '@/utils/get-page-title'
// import { accessSync } from 'fs'

NProgress.configure({
  showSpinner: false
}) // NProgress配置

const whiteList = ['/login'] // 没有重定向白名单

router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = store.getters.token;
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      // 确定用户是否通过getInfo获得了他的权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // 注意:角色必须是一个对象数组!例如:['admin']或['developer'，'editor']
          const {
            list
          } = await store.dispatch('user/getInfo');

          if (list == undefined) {
            await store.dispatch('user/resetToken')
            next(`/${to.path}`)
            NProgress.done()
          } else {
            const accessRoutes = await store.dispatch('permission/generateRoutes', list);
            // 根据角色生成可访问路由映射

            // 动态添加可访问路由
            router.addRoutes(accessRoutes)

            // 校验方法，以确保addRoutes是完整的
            // 设置replace: true，这样导航就不会留下历史记录
            next({
              ...to,
              replace: true
            })
          }

        } catch (error) {
          // 删除token，进入登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有token */

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单，直接去查看
      next()
    } else {
      // 没有访问权限的其他页面被重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
