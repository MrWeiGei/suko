import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'

import router, {
  resetRouter
} from '@/router'

import {
  login,
  getInfo,
  logout
} from "@/api/user"

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({
    commit,
    state
  }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(res => {
        if (res.code == 600) {
          resolve(res)
          return
        }
        console.log(getToken())
        commit('SET_TOKEN', '')
        removeToken()
        commit('SET_TOKEN', res.res);
        setToken(res.res);
        console.log(getToken())
        resolve(res)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo().then(e => {
        if (e == undefined) {
          var data = {
            roles: ['user'],
            name: '长得丑活得久，长得帅老的快',
            list: undefined
          }
          resolve(data)
        } else {
          var data = {
            roles: ['user'],
            name: '长得丑活得久，长得帅老的快',
            list: e.res
          }
          const {
            roles,
            name,
            list
          } = data;
          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          resolve(data)
        }
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout().then(res => {
        if (res.code == 0) {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()
          resolve()
        }
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // // 动态地修改权限
  // changeRoles({
  //   commit,
  //   dispatch
  // }, role) {
  //   return new Promise(async resolve => {
  //     const token = role + '-token'

  //     commit('SET_TOKEN', token)
  //     setToken(token)

  //     const {
  //       roles
  //     } = await dispatch('getInfo')

  //     resetRouter()

  //     // 根据角色生成可访问路由映射
  //     const accessRoutes = await dispatch('permission/generateRoutes', roles, {
  //       root: true
  //     })

  //     // 动态添加可访问路由
  //     router.addRoutes(accessRoutes)

  //     resolve()
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
