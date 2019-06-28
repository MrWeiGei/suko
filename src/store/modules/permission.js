import {
  asyncRoutes,
  constantRoutes
} from '@/router'

import Layout from '@/layout'
/**
 * 使用 meta.roles 确定当前用户是否具有权限
 * @param roles
 * @param route
 */
function makeRouter(route) {
  var res = [];
  route.children.forEach(i => {
    const item = {
      ...i
    }
    var Unified = item.router.split('/').pop();
    var next = {
      path: Unified,
      component: () => import(`@/views${item.router}`),
      name: Unified,
      meta: {
        title: Unified
      }
    };
    if (item.visible == '0') {
      next.hidden = true;
    }

    if (item.children) {
      next = {};
      next = {
        path: Unified,
        component: () => import(`@/views${item.router}/index`),
        name: Unified,
        meta: {
          title: Unified
        }
      };
      if (item.children.length == 1) {
        next.alwaysShow = true
      }
      next.children = [];
      next.children = makeRouter(item)
    }

    res.push(next)
  })
  return res;
}

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes) {
  const res = [];
  routes.forEach(route => {
    const tmp = {
      ...route
    }
    var Unified = tmp.router.split('/').pop();
    if (tmp.icon) {
      var first = {
        path: tmp.router,
        component: Layout,
        name: Unified,
        meta: {
          title: Unified,
          icon: tmp.icon
        }
      }
    }
    if (tmp.visible == '0') {
      first.hidden = true;
    }
    if (tmp.children) {
      first.children = [];
      first.children = makeRouter(tmp)
    }
    if (tmp.children.length == 1) {
      first.alwaysShow = true;
    }
    res.push(first)
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({
    commit
  }, list) {
    return new Promise(resolve => {
      let accessedRoutes = filterAsyncRoutes(list);
      accessedRoutes.push({
        path: '*',
        redirect: '/404',
        hidden: true
      })
      console.log(accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
      // commit('SET_ROUTES', asyncRoutes)
      // resolve(asyncRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
