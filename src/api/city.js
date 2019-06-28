import request from '@/utils/request'

export function getCity(data) {
  return request({
    url: '/getCity/findParentId',
    method: 'post',
    data
  })
}
