import request from '@/utils/request'


export function createOne(data) {
  return request({
    url: '/infoCity/add',
    method: 'post',
    data,
  })
}

export function fetchList(data) {
  return request({
    url: '/infoCity/getPageList',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: '/infoCity/update',
    method: 'post',
    data,
  })
}

export function delOne(data) {
  return request({
    url: '/infoCity/delete',
    method: 'post',
    data
  })
}

export function simpeCode(data) {
  return request({
    url: '/infoCity/getSimpeCode',
    method: 'post',
    data
  })
}
