/**
 * 로컬 미리보기 서버 (개발용)
 *   node tools/serve.mjs [port]
 * 실제 배포는 GitHub Pages 정적 호스팅을 사용하므로 이 파일은 로컬 확인용입니다.
 */
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const port = Number(process.argv[2] || 4173)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
}

createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
    const rel = normalize(urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, ''))
    if (rel.startsWith('..')) {
      res.writeHead(403).end('forbidden')
      return
    }
    const file = join(root, rel)
    const body = await readFile(file)
    res.writeHead(200, {
      'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    })
    res.end(body)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('not found')
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`preview: http://127.0.0.1:${port}/`)
})
