import request from '@/utils/request'


export function createOne(data) {
  return request({
    url: '/role/addRole',
    method: 'post',
    data,
    json: true,
  })
}

export function fetchList(data) {
  return request({
    url: '/role/getPageList',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: '/role/updRole',
    method: 'post',
    data,
    json: true,
  })
}

export function delOne(data) {
  return request({
    url: '/role/delRole',
    method: 'post',
    data
  })
}

export function searchList() {
  return request({
    url: '/role/getRoleList',
    method: 'post',
  })
}
