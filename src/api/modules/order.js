import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
import isInteger from 'lodash/isInteger'


// ====================== 采集站点配置页面 =====================
// 获取杂志信息的列表
export function list (params) {
  return request({
    url: requestUrl('/api/v1/journal_order/page'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}


// 获取杂志信息
export function info (id) {
  return request({
    url: requestUrl('/api/v1/journal_order/query_id' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: requestParam({}, 'get')
  })
}


// 修改采集站点配置
export function update (params) {
  return request({
    url: requestUrl('/api/v1/journal/update'),
    method: 'post',
    data: requestParam(params)
  })
}

// 删除采集站点配置
export function del (params) {
  return request({
    url: requestUrl('/api/v1/journal_order/delete'),
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

export function upload (file) {
  return request({
    url: requestUrl('/api/common/save_file'),
    method: 'post',
    data: requestParam(file, 'post', false)
  })
}

// ====================== 采集结果页面 =====================
// 获取采集结果
export function getResult (params) {
  return request({
    url: requestUrl('/api/resultInfo/list'),
    method: 'get',
    params: requestParam(params, 'get', false)
  })
}

export function getConviersion (params) {
  return request({
    url: requestUrl('/api/resultInfo/challenge'),
    method: 'get',
    params: requestParam(params, 'get', false)
  })
}

// 获取采集结果的比对列表数据
export function comparison (params) {
  return request({
    url: requestUrl('/sys/spiderconfig/comparison'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取所有模板数据，用来比对
export function getAllTemplate () {
  return request({
    url: requestUrl('/api/resultInfo/is_model'),
    method: 'get',
    params: requestParam({}, 'get', false)
  })
}


// 获取当前的采集结果，用来比对结果
export function getCurrentDataList (params) {
  return request({
    url: requestUrl('/api/resultInfo/comparison'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

// 获取已选择的模板数据，用来比对结果
export function getChooseDataList (params) {
  return request({
    url: requestUrl('/api/resultInfo/comparison'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}