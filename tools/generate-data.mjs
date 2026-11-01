/**
 * 사주 대시보드 데이터 생성기
 * ------------------------------------------------------------------
 * saju-fortune 패키지의 실제 계산 결과(사주팔자·오행·용신·대운)를 그대로 쓰고,
 * 세운(年度干支)과의 상호작용으로 연도별 점수를 산출한다.
 *
 * 점수 모델 (투명성 확보를 위해 사이트에도 그대로 표기됨)
 *  1) 오행별 기본값: 용신1 +10 / 용신2 +8 / 재성·기타 보정 / 과다 -1 / 부족+극 -4
 *  2) 연도 점수 = 50 + (천간값 * w + 지지값 * 0.8 * w) * 1.6 + 대운보정
 *  3) 차원별 가중치 w 는 운세 주제(연애/사업/금전/건강)마다 다르게 부여
 *  4) 5년 단위 구간은 연도 점수의 평균으로 집계
 *
 * ⚠ 이 점수는 전통 해석을 참고한 "상대 지표"이며 길흉의 확정이 아니다.
 */
import { createRequire } from 'node:module'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const require = createRequire(import.meta.url)
const { analyzeSaju, callSajuTool } = require('saju-fortune')

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '..', 'data.js')

/* ---------------------------------------------------------------- 입력 */
const SUBJECT = {
  name: 'bluet4166',
  lunar: '1974-08-18 (음력)',
  solar: '1974-10-03',
  time: '16:00',
  timeLabel: '신시(申時, 15:30~17:30)',
  gender: 'female',
  genderKo: '여성',
  birthCity: null,
  // 음력 1974-08-18 → 양력 1974-10-03 (KASI 기반 korean-lunar-calendar 변환)
  conversion: 'KASI 음양력 데이터 기반 (korean-lunar-calendar). 2024년 추석 대조 검증 완료',
}

const INPUT = {
  birthDate: SUBJECT.solar,
  birthTime: SUBJECT.time,
  calendar: 'solar',
  gender: 'female',
}

/* ------------------------------------------------- 패키지 원본 계산 */
const saju = analyzeSaju(INPUT, { analysisType: 'fortune', fortuneType: 'general', targetYear: 2026 })
const daeunRaw = callSajuTool('get_dae_un', { ...INPUT })

/* ---------------------------------------------------- 오행 유틸 */
const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']
const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']
const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const STEM_EL = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water']
const BRANCH_EL = ['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water']
const EL_KO = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' }
const EL_HANJA = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' }
const EL_COLOR = { wood: '#4ade80', fire: '#f87171', earth: '#fbbf24', metal: '#e2e8f0', water: '#60a5fa' }

/** 연도 → 세운 간지 */
function yearGanzhi(year) {
  const s = ((year - 4) % 10 + 10) % 10
  const b = ((year - 4) % 12 + 12) % 12
  return {
    year,
    stem: STEMS[s], stemHanja: STEMS_HANJA[s], stemEl: STEM_EL[s],
    branch: BRANCHES[b], branchHanja: BRANCHES_HANJA[b], branchEl: BRANCH_EL[b],
    label: STEMS[s] + BRANCHES[b],
    hanja: STEMS_HANJA[s] + BRANCHES_HANJA[b],
  }
}

/* -------------------------------------------- 오행 기본값(이 사람 전용) */
const counts = saju.fiveElements
const yong1 = saju.yongsin.primary
const yong2 = saju.yongsin.secondary
const dayEl = saju.dayMaster.element // 화

// 일간을 극하는 오행 (수극화)
const CONTROLS = { wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire' }
const opposingEl = Object.keys(CONTROLS).find((k) => CONTROLS[k] === dayEl) // water

// 금(金)은 이 사주에서 재성 → 재물의 그릇이므로 소폭 가점
// 토(土)는 식상이 이미 2개로 과다해 설기 소모 → 감점
const SPECIAL = {
  metal: { value: 2, reason: '재성 — 재물의 그릇(과다 아님)' },
  earth: { value: -2, reason: '식상 과다 — 설기·소모' },
}

const elementBase = {}
for (const el of Object.keys(EL_KO)) {
  let v = 0
  let reason = '중립'
  if (el === yong1) { v = 10; reason = '용신(1순위)' }
  else if (el === yong2) { v = 8; reason = '희신(2순위)·부족 보완' }
  else if (el === opposingEl) { v = -5; reason = '구신 — 일간을 극하고 부족' }
  else if (SPECIAL[el]) { v = SPECIAL[el].value; reason = SPECIAL[el].reason }
  elementBase[el] = { value: v, reason, count: counts[el] }
}

/* ------------------------------------------------ 차원별 가중치 */
const DIM_WEIGHTS = {
  love: { wood: 1.0, fire: 1.3, earth: 0.6, metal: 0.7, water: 0.9 },
  career: { wood: 1.0, fire: 0.8, earth: 1.1, metal: 1.2, water: 0.9 },
  money: { wood: 0.6, fire: 0.7, earth: 1.0, metal: 1.5, water: 0.8 },
  health: { wood: 1.1, fire: 1.2, earth: 0.9, metal: 0.8, water: 1.3 },
}
const DIM_KO = { love: '연애운', career: '사업운', money: '금전운', health: '건강운' }

/* ------------------------------------------------------- 대운 구간 */
const birthYear = 1974
const daeun = daeunRaw.cycles.map((c, i, arr) => {
  const from = birthYear + c.age
  const to = (arr[i + 1] ? birthYear + arr[i + 1].age : from + 10) - 1
  const stemEl = STEM_EL[STEMS.indexOf(c.label[0])]
  const branchEl = BRANCH_EL[BRANCHES.indexOf(c.label[1])]
  let delta = 0
  if ([stemEl, branchEl].some((e) => e === yong1 || e === yong2)) delta += 3
  else if ([stemEl, branchEl].some((e) => e === opposingEl)) delta -= 2
  return { age: c.age, from, to, label: c.label, hanja: c.hanja, stemEl, branchEl, delta }
})

const daeunOf = (year) => daeun.find((d) => year >= d.from && year <= d.to) || daeun[daeun.length - 1]

/* --------------------------------------------------- 연도별 점수 */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

function scoreYear(year) {
  const gz = yearGanzhi(year)
  const d = daeunOf(year)
  const scores = {}
  for (const [dim, w] of Object.entries(DIM_WEIGHTS)) {
    const raw =
      elementBase[gz.stemEl].value * w[gz.stemEl] +
      elementBase[gz.branchEl].value * 0.8 * w[gz.branchEl]
    scores[dim] = Math.round(clamp(50 + raw * 1.6 + d.delta, 15, 97))
  }
  scores.overall = Math.round(
    (scores.love + scores.career + scores.money + scores.health) / 4
  )
  return { ...gz, daeun: d.label, scores }
}

const START = 2026
const SPAN = 25 // 5개 구간 × 5년
const yearly = Array.from({ length: SPAN }, (_, i) => scoreYear(START + i))

const buckets = []
for (let i = 0; i < SPAN; i += 5) {
  const slice = yearly.slice(i, i + 5)
  const avg = (k) => Math.round(slice.reduce((s, y) => s + y.scores[k], 0) / slice.length)
  const best = slice.reduce((a, b) => (b.scores.overall > a.scores.overall ? b : a))
  buckets.push({
    label: `${slice[0].year}–${slice[5 - 1].year}`,
    from: slice[0].year,
    to: slice[slice.length - 1].year,
    daeun: daeunOf(slice[0].year).label,
    daeunHanja: daeunOf(slice[0].year).hanja,
    scores: {
      love: avg('love'),
      career: avg('career'),
      money: avg('money'),
      health: avg('health'),
      overall: avg('overall'),
    },
    bestYear: best.year,
    bestScore: best.scores.overall,
    years: slice.map((y) => ({ year: y.year, label: y.label, scores: y.scores })),
  })
}

/* --------------------------------------------------------- 사주 기둥 */
const posKo = { year: '연주', month: '월주', day: '일주', hour: '시주' }
const pillars = ['year', 'month', 'day', 'hour'].map((k) => {
  const p = saju.pillars[k]
  return {
    pos: posKo[k],
    label: p.label,
    hanja: p.hanja,
    stem: p.stem, stemHanja: p.stemHanja, stemEl: p.stemElement, stemKo: p.stemElementKo,
    branch: p.branch, branchHanja: p.branchHanja, branchEl: p.branchElement, branchKo: p.branchElementKo,
    animal: p.branchAnimal,
    yinYang: p.yinYang,
  }
})

/* ---------------------------------------------------- 주제별 콘텐츠 */
const year2026 = yearly[0]
const curDaeun = daeunOf(2026)

const topics = {
  love: {
    key: 'love', title: '연애운', hanja: '緣', accent: '#f472b6',
    score: year2026.scores.love,
    headline: '표현이 관계의 온도를 바꾸는 시기',
    summary:
      '정화(丁火)는 크게 타오르기보다 곁을 데우는 불입니다. 애정 표현이 은근하고 상대가 먼저 알아채기를 기다리는 편이라, 마음은 깊어도 전달이 늦어질 수 있습니다. 부족한 화(火)를 채우는 해에는 그 표현의 문턱이 낮아집니다.',
    strengths: [
      '한 사람에게 오래 집중하는 안정적인 애정',
      '상대의 컨디션을 먼저 읽는 섬세함',
      '말보다 행동으로 신뢰를 쌓는 힘',
    ],
    cautions: [
      '서운함을 오래 담아두면 어느 순간 한 번에 터집니다',
      '확신이 설 때까지 기다리다 타이밍을 놓치기 쉽습니다',
      '돌봄이 과해지면 상대가 미안해하거나 부담을 느낄 수 있습니다',
    ],
    advice: [
      '좋을 때 짧게라도 말로 표현하기 — 하루 한 문장이면 충분합니다',
      '서운함은 48시간 안에 꺼내는 규칙을 정해 보세요',
      '붉은 계열 소품, 꽃, 따뜻한 조명이 화 기운을 보완합니다',
    ],
  },
  career: {
    key: 'career', title: '사업운', hanja: '業', accent: '#fbbf24',
    score: year2026.scores.career,
    headline: '혼자 밀기보다 사람을 통해 완성되는 구조',
    summary:
      '인성(갑·인)이 두 자리에 뿌리내려 기획·문서·교육·상담에서 강점이 나오고, 재성(유·신)이 실무 감각을 받쳐 줍니다. 시주의 상관(무토)은 표현과 추진을 더합니다. 즉 "혼자 잘하는 일"보다 "정리해서 남에게 넘기는 일"에서 성과가 커집니다.',
    strengths: [
      '복잡한 것을 구조화해 설명하는 능력',
      '끝까지 마무리하는 책임감',
      '사람을 가르치고 키우는 데서 나오는 신뢰',
    ],
    cautions: [
      '일을 다 떠안으면 정작 성과가 내 것이 되지 않습니다',
      '완벽을 기다리다 시작이 늦어질 수 있습니다',
      '감정 소모가 실무 판단을 흐릴 때가 있습니다',
    ],
    advice: [
      '올해는 "위임 목록"을 문서로 만들어 두세요',
      '강의·자문·기획처럼 지식을 파는 형태와 궁합이 좋습니다',
      '큰 결정은 하루 묵혔다가 진행하세요',
    ],
  },
  money: {
    key: 'money', title: '금전운', hanja: '財', accent: '#4ade80',
    score: year2026.scores.money,
    headline: '버는 힘보다 지키는 규칙이 중요한 재물',
    summary:
      '금(金)이 재성으로 두 개 있어 관리형 재물에 강합니다. 다만 편재(유금) 성향이라 한 번에 크게 굴리는 방식보다, 정해진 규칙으로 꾸준히 쌓는 쪽이 체질에 맞습니다. 목돈은 "벌기"보다 "지키는 구조"를 먼저 세우는 편이 안전합니다.',
    strengths: [
      '새는 돈을 알아채는 감각',
      '고정 지출을 구조화하는 능력',
      '필요할 때를 위한 현금흐름 관리',
    ],
    cautions: [
      '사람 좋아서 하는 지출이 반복됩니다',
      '변동성 큰 자산에 감정적으로 반응하기 쉽습니다',
      '보증·대여는 관계와 재물을 동시에 흔듭니다',
    ],
    advice: [
      '수입의 일정 비율을 자동이체로 먼저 떼어 두세요',
      '투자 결정은 "규칙을 적고 나서" 실행하세요',
      '큰 지출 전 하루 대기 규칙이 특히 효과적입니다',
    ],
  },
  health: {
    key: 'health', title: '건강운', hanja: '壽', accent: '#60a5fa',
    score: year2026.scores.health,
    headline: '연료와 휴식, 두 가지가 함께 필요한 체질',
    summary:
      '부족한 화(火)·수(水)는 전통적으로 순환(체온·심혈관·수면)과 수분·호르몬 축으로 읽습니다. 일이 많을 때보다 "열을 내는 연료와 식히는 물"이 없을 때 지침이 오는 구조입니다. 50대에는 이 축이 실제 컨디션과 겹치는 영역이라 규칙이 특히 중요합니다.',
    strengths: [
      '증상이 오기 전에 몸의 신호를 먼저 감지하는 편',
      '한번 규칙을 만들면 오래 유지하는 힘',
    ],
    cautions: [
      '갈증을 늦게 느껴 수분이 부족해지기 쉽습니다',
      '열을 내는 일에 몰입하면 회복을 뒤로 미룹니다',
      '수면 시간이 흔들리면 회복이 급격히 느려집니다',
    ],
    advice: [
      '아침 햇빛 15분 — 화 기운과 생체리듬을 동시에',
      '물은 목마르기 전에 마시기 (하루 1.5L 이상)',
      '주 3회, 숨이 차는 유산소 20분 이상',
      '갱년기 관련 증상은 사주가 아니라 전문의 상담으로',
    ],
  },
}

/* ------------------------------------------------------- 오늘의 정보 */
const daily = callSajuTool('get_daily_fortune', { ...INPUT })

const data = {
  meta: {
    generatedAt: new Date().toISOString(),
    engine: 'saju-fortune (npm) — 로컬 계산, MCP 미사용',
    converter: SUBJECT.conversion,
    disclaimer:
      '이 페이지는 전통 해석에 기반한 참고 자료입니다. 의료·투자·법률 판단을 대신하지 않으며, 점수는 길흉의 확정이 아니라 상대적 흐름을 보여 주는 지표입니다.',
    scoreModel: {
      formula: '연도점수 = 50 + (천간값×w + 지지값×0.8×w)×1.6 + 대운보정',
      aggregation: '5년 구간 점수 = 해당 구간 연도 점수의 평균',
      elementBase,
      weights: DIM_WEIGHTS,
    },
  },
  subject: SUBJECT,
  pillars,
  dayMaster: saju.dayMaster,
  fiveElements: saju.fiveElements,
  dominantElements: saju.dominantElements,
  weakElements: saju.weakElements,
  yongsin: saju.yongsin,
  daeun: daeun.filter((d) => d.to >= 2026),
  currentDaeun: curDaeun,
  buckets,
  yearly,
  topics,
  today: {
    date: daily.targetDate,
    summary: daily.fortune.summary,
  },
}

writeFileSync(
  OUT,
  '/* 자동 생성 파일 — tools/generate-data.mjs 로 재생성하세요 */\n' +
    'window.SAJU_DATA = ' +
    JSON.stringify(data, null, 2) +
    ';\n',
  'utf8'
)

console.log('generated:', OUT)
console.log('buckets:')
for (const b of buckets) {
  const s = b.scores
  console.log(
    `  ${b.label}  대운 ${b.daeun}  종합 ${s.overall}  연애 ${s.love}  사업 ${s.career}  금전 ${s.money}  건강 ${s.health}`
  )
}
