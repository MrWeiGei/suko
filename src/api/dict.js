import request from '@/utils/request'


export function search(key) {
  return request({
    url: '/dict/getDict',
    method: 'post',
    data: {
      dictKey: key
    }
  })
}
