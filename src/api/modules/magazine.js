import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
import isInteger from 'lodash/isInteger'


// ====================== 采集站点配置页面 =====================
// 获取杂志信息的列表
export function list (params) {
  return request({
    url: requestUrl('/api/v1/journal/page'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}


// 获取杂志信息
export function info (id) {
  return request({
    url: requestUrl('/api/v1/journal/query_id' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: requestParam({}, 'get')
  })
}

// 添加杂志配置
export function add (params) {
  return request({
    url: requestUrl('/api/v1/journal/save'),
    method: 'post',
    data: requestParam(params)
  })
}

// 修改杂志信息配置
export function update (params) {
  return request({
    url: requestUrl('/api/v1/journal/update'),
    method: 'post',
    data: requestParam(params)
  })
}

// 删除杂志信息配置
export function del (params) {
  return request({
    url: requestUrl('/api/v1/journal/delete'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

// 审核上线
export function toExamine (id) {
  return request({
    url: requestUrl('/api/v1/journal/set_online'),
    method: 'get',
    params: requestParam(id, 'get',false)
  })
}

// 照片上传
export function upload (file) {
  return request({
    url: requestUrl('/api/common/save_file'),
    method: 'post',
    data: requestParam(file, 'post', false)
  })
}


// 添加杂志配置
export function wxadd (id) {
  return request({
    url: requestUrl('/api/v1/journal_order/wxadd'),
    method: 'get',
    params: requestParam(id,'get',false)
  })
}
// 添加杂志配置
export function loadImg (id) {
  return request({
    url: requestUrl('/api/v1/journal_order/wxadd'),
    method: 'get',
    params: requestParam(id,'get',false),
    responseType: 'blob'
  })
}
