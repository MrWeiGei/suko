import request from '@/utils/request'


export function createOne(data) {
  return request({
    url: '/infoService/addService',
    method: 'post',
    data,
    json: true,
  })
}

export function fetchList(data) {
  return request({
    url: '/infoService/getPageList',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: '/infoService/updService',
    method: 'post',
    data,
    json: true,
  })
}

export function delOne(data) {
  return request({
    url: '/infoService/delService',
    method: 'post',
    data
  })
}

export function searchList(data) {
  return request({
    url: '/infoService/search',
    method: 'post',
    data
  })
}
