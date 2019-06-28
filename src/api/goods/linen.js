import request from '@/utils/request'


export function createOne(data) {
  return request({
    url: '/infoCloth/addCloth',
    method: 'post',
    data,
    json: true,
  })
}

export function fetchList(data) {
  return request({
    url: '/infoCloth/getPageList',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: '/infoCloth/update',
    method: 'post',
    data,
    json: true,
  })
}

export function delOne(data) {
  return request({
    url: '/infoCloth/delete',
    method: 'post',
    data
  })
}

export function searchList(data) {
  return request({
    url: '/infoCloth/search',
    method: 'post',
    data
  })
}
