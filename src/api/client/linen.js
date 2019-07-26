import request from '@/utils/request'


export function createOne(data) {
  return request({
    url: '/SysUserVendor/addVendor',
    method: 'post',
    data,
    json: true,
  })
}

export function fetchList(data) {
  return request({
    url: '/SysUserVendor/getPageList',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: '/SysUserVendor/update',
    method: 'post',
    data,
    json: true,
  })
}

export function delOne(data) {
  return request({
    url: '/SysUserVendor/delect',
    method: 'post',
    data
  })
}

export function searchList(data) {
  return request({
    url: '/SysUserVendor/search',
    method: 'post',
    data
  })
}
