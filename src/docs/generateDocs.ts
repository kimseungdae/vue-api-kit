import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { apiMap } from '../definitions/apiMap'
import { generateMarkdownDoc } from './utils/generateMarkdownDoc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * API 문서 헤더 템플릿
 */
const HEADER = `# API 문서

이 문서는 자동으로 생성된 API 문서입니다.
마지막 업데이트: ${new Date().toLocaleString('ko-KR')}

---
`

/**
 * API 문서를 생성하는 함수
 */
async function buildDocs() {
  try {
    // 모든 API 스펙을 문서화
    const docs = Object.entries(apiMap)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // API 키 기준으로 정렬
      .map(([key, spec]) => generateMarkdownDoc(key, spec))
      .join('\n\n')

    // 최종 문서 생성
    const finalDoc = `${HEADER}\n${docs}`

    // docs 디렉토리가 없으면 생성
    const docsDir = path.resolve(__dirname, '../../docs')
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true })
    }

    // 문서 파일 저장
    const outPath = path.resolve(docsDir, 'api.md')
    fs.writeFileSync(outPath, finalDoc, 'utf-8')
    
    console.info('📘 API 문서 생성 완료!')
    console.info(`📁 저장 위치: ${outPath}`)
    console.info(`📊 총 ${Object.keys(apiMap).length}개의 API가 문서화되었습니다.`)
  } catch (error) {
    console.error('❌ API 문서 생성 중 오류 발생:', error)
    process.exit(1)
  }
}

// 문서 생성 실행
buildDocs().catch(error => {
  console.error('❌ 예기치 않은 오류 발생:', error)
  process.exit(1) 
}) 