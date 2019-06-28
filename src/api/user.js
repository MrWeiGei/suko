import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/j_spring_security_check',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/menu/getMenuByUser',
    method: 'get'
  })
}
export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function getCode() {
  return request({
    url: '/login/validateCode',
    method: 'get'
  })
}
