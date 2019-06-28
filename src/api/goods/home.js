import request from '@/utils/request'


export function createOne(data) {
  return request({
    url: '/infoHouse/savaOrUpdate',
    method: 'post',
    data,
    json: true,
  })
}
export function fetchList(data) {
  return request({
    url: '/infoHouse/getPageList',
    method: 'get',
    params: data
  })
}

export function getByid(data) {
  return request({
    url: '/infoHouse/getById',
    method: 'get',
    data
  })
}

export function search(data) {
  return request({
    url: '/infoHouse/search',
    method: 'get',
    data
  })
}
