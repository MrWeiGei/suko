import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/dept/getDeptList',
    method: 'get',
  })
}

export function getPageList(data) {
  return request({
    url: '/dept/getPageList',
    method: 'post',
    data
  })
}


export function createOne(data) {
  return request({
    url: '/dept/addDept',
    method: 'post',
    data
  })
}


export function updateOne(data) {
  return request({
    url: '/dept/updDept',
    method: 'post',
    data
  })
}


export function deleteOne(data) {
  return request({
    url: '/dept/delDept',
    method: 'post',
    data
  })
}
