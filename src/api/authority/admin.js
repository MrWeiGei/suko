import request from '@/utils/request'


export function createOne(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data,
    json: true,
  })
}

export function fetchList(data) {
  return request({
    url: '/user/getPageList',
    method: 'post',
    data
  })
}

export function updateOne(data) {
  return request({
    url: '/user/updUser',
    method: 'post',
    data,
    json: true,
  })
}

export function delOne(data) {
  return request({
    url: '/user/delUser',
    method: 'post',
    data
  })
}

// export function searchList() {
//   return request({
//     url: '/user/getRoleList',
//     method: 'post',
//   })
// }
