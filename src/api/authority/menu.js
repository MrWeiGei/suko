import request from '@/utils/request'


export function createOne(data) {
  return request({
    url: '/menu/addMenu',
    method: 'post',
    data
  })
}

export function delOne(data) {
  return request({
    url: '/menu/delMenu',
    method: 'post',
    data
  })
}

export function fetchList(data) {
  return request({
    url: '/menu/getPageList',
    method: 'post',
    data
  })
}


export function searchList(data) {
  return request({
    url: '/menu/getLevelList',
    method: 'post',
    data
  })
}

export function editone(data) {
  return request({
    url: '/menu/updMenu',
    method: 'post',
    data
  })
}

export function getMenuList() {
  return request({
    url: '/menu/getMenuList',
    method: 'post'
  })
}
