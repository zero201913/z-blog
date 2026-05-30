/**
 * =========================================
 * @file        [[path]].js
 * @author      hongliang
 * @created     2026-05-30 13:42
 * @version     1.0.0
 * @description Cloudflare Pages Function — API 反向代理
 *
 * -----------------------------------------
 *  File Purpose:
 *      - 将 /api/* 请求转发到真实后端 API (https://uapis.cn)
 *      - 解决本地 Vite Proxy 在 Cloudflare 部署后失效的问题
 *      - 路径: functions/api/[[path]].js 匹配所有 /api/* 路由
 * -----------------------------------------
 * =========================================
 */

const API_BASE = 'https://uapis.cn'

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  const upstream = `${API_BASE}${url.pathname}${url.search}`

  const headers = new Headers(request.headers)
  headers.set('Host', new URL(API_BASE).host)
  headers.set('Origin', API_BASE)

  const response = await fetch(upstream, {
    method: request.method,
    headers,
    body: request.method !== 'GET' && request.method !== 'HEAD'
      ? request.body
      : undefined,
    redirect: 'follow',
  })

  const newHeaders = new Headers(response.headers)
  newHeaders.set('Access-Control-Allow-Origin', '*')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  })
}
