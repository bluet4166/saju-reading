/**
 * 사주 대시보드 데이터 생성기 (멀티 인물)
 * ------------------------------------------------------------------
 * saju-fortune 패키지의 실제 계산 결과(사주팔자·오행·용신·대운)를 그대로 쓰고,
 * 세운(年度干支)과의 상호작용으로 연도별 점수를 산출한다.
 *
 * 점수 모델 (투명성 확보를 위해 사이트에도 그대로 표기됨)
 *  1) 오행별 기본값: 용신 +10 / 희신 +8 / 재성 +2 / 식상 과다 -2 / 구신(극) -5 / 비겁 과다 -2
 *  2) 연도 점수 = 50 + (천간값 × w + 지지값 × 0.8 × w) × 1.6 + 대운보정
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

/* ---------------------------------------------------------- 공통 상수 */
const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계']
const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해']
const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const STEM_EL = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water']
const BRANCH_EL = ['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water']
const EL_KO = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' }

// 일간 오행이 생하는 오행(식상) / 극하는 오행(재성)
const GENERATES = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' }
const CONTROLS = { wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire' }
// 일간을 극하는 오행(관성) / 일간을 생하는 오행(인성)
const CONTROLLED_BY = Object.fromEntries(Object.entries(CONTROLS).map(([k, v]) => [v, k]))
const GENERATED_BY = Object.fromEntries(Object.entries(GENERATES).map(([k, v]) => [v, k]))

const DIM_KEYS = ['love', 'career', 'job', 'money', 'study', 'health']

/**
 * 주제별 가중치는 "오행 이름"이 아니라 "십성 역할"에 붙는다.
 * 사람마다 용신 오행이 달라도 같은 해석 틀을 쓰기 위해서다.
 *   peer 비겁 / output 식상 / wealth 재성 / officer 관성 / resource 인성
 */
const ROLE_WEIGHTS = {
  love: { peer: 1.0, output: 1.4, wealth: 1.8, officer: 1.5, resource: 0.9 },
  career: { peer: 0.9, output: 1.8, wealth: 1.3, officer: 1.5, resource: 1.0 },
  job: { peer: 0.8, output: 0.7, wealth: 1.1, officer: 2.2, resource: 1.0 },
  money: { peer: 0.6, output: 1.2, wealth: 2.2, officer: 0.7, resource: 0.5 },
  study: { peer: 1.0, output: 0.8, wealth: 0.6, officer: 0.9, resource: 2.2 },
  health: { peer: 1.5, output: 1.0, wealth: 0.8, officer: 1.2, resource: 1.4 },
}

/** 오행 → 십성 역할 */
function roleMap(dayEl) {
  return {
    [dayEl]: 'peer',
    [GENERATES[dayEl]]: 'output',
    [CONTROLS[dayEl]]: 'wealth',
    [CONTROLLED_BY[dayEl]]: 'officer',
    [GENERATED_BY[dayEl]]: 'resource',
  }
}

const START_YEAR = 2026
const SPAN = 25 // 5개 구간 × 5년

/* ------------------------------------------------------------- 인물 정의 */
const PEOPLE = [
  {
    id: 'p1974',
    label: '1974 · 정축',
    name: 'bluet4166',
    relation: '본인',
    lunar: '1974-08-18 (음력)',
    solar: '1974-10-03',
    time: '16:00',
    timeLabel: '신시(申時, 15:30~17:30)',
    gender: 'female',
    genderKo: '여성',
    birthCity: null,
    conversion: 'KASI 음양력 데이터 기반. 2024년 추석(음 8/15 → 양 9/17) 대조 검증. 1974년 8월은 평달',
    timeNote: '16:00은 신시 한가운데라 경도 보정(±30분)에도 시주가 유지됩니다.',
  },
  {
    id: 'p1975',
    label: '1975 · 을유',
    name: '가족',
    relation: '가족',
    lunar: '1975-07-01 (음력)',
    solar: '1975-08-07',
    time: '05:20',
    timeLabel: '묘시(卯時, 05:00~07:00)',
    gender: 'female',
    genderKo: '여성',
    birthCity: null,
    conversion: 'KASI 음양력 데이터 기반. 2024년 추석 대조 검증. 1975년은 윤달 없음',
    timeNote:
      '05:20은 경계(5시)에서 20분 차이입니다. 인시(戊寅)·묘시(己卯) 모두 토+목 조합이라 오행 분포와 풀이 결론은 동일합니다.',
  },
  {
    id: 'p2005',
    label: '2005 · 기축',
    name: '가족',
    relation: '가족',
    lunar: '2005-11-01 (양력)',
    solar: '2005-11-01',
    time: '11:15',
    timeLabel: '오시(午時, 11:00~13:00)',
    gender: 'male',
    genderKo: '남성',
    birthCity: null,
    conversion: '11월 1일은 입동(11/7) 이전이라 술월(戌月)입니다',
    timeNote: '11:15는 오시(11:00~13:00) 초반이라 시주 경계에서 충분히 떨어져 있습니다.',
  },
]

/* ------------------------------------------------------- 주제별 콘텐츠 */
const TOPICS = {
  p1974: {
    love: {
      title: '연애운', hanja: '緣', accent: '#f472b6',
      headline: '표현이 관계의 온도를 바꾸는 시기',
      summary:
        '정화(丁火)는 크게 타오르기보다 곁을 데우는 불입니다. 애정 표현이 은근하고 상대가 먼저 알아채기를 기다리는 편이라, 마음은 깊어도 전달이 늦어질 수 있습니다. 부족한 화(火)를 채우는 해에는 그 표현의 문턱이 낮아집니다.',
      strengths: ['한 사람에게 오래 집중하는 안정적인 애정', '상대의 컨디션을 먼저 읽는 섬세함', '말보다 행동으로 신뢰를 쌓는 힘'],
      cautions: ['서운함을 오래 담아두면 어느 순간 한 번에 터집니다', '확신이 설 때까지 기다리다 타이밍을 놓치기 쉽습니다', '돌봄이 과해지면 상대가 부담을 느낄 수 있습니다'],
      advice: ['좋을 때 짧게라도 말로 표현하기 — 하루 한 문장이면 충분합니다', '서운함은 48시간 안에 꺼내는 규칙을 정해 보세요', '붉은 계열 소품, 꽃, 따뜻한 조명이 화 기운을 보완합니다'],
    },
    career: {
      title: '사업운', hanja: '業', accent: '#fbbf24',
      headline: '혼자 밀기보다 사람을 통해 완성되는 구조',
      summary:
        '인성(갑·인)이 두 자리에 뿌리내려 기획·문서·교육·상담에서 강점이 나오고, 재성(유·신)이 실무 감각을 받쳐 줍니다. 시주의 상관(무토)은 표현과 추진을 더합니다. 즉 "혼자 잘하는 일"보다 "정리해서 남에게 넘기는 일"에서 성과가 커집니다.',
      strengths: ['복잡한 것을 구조화해 설명하는 능력', '끝까지 마무리하는 책임감', '사람을 가르치고 키우는 데서 나오는 신뢰'],
      cautions: ['일을 다 떠안으면 정작 성과가 내 것이 되지 않습니다', '완벽을 기다리다 시작이 늦어질 수 있습니다', '감정 소모가 실무 판단을 흐릴 때가 있습니다'],
      advice: ['올해는 "위임 목록"을 문서로 만들어 두세요', '강의·자문·기획처럼 지식을 파는 형태와 궁합이 좋습니다', '큰 결정은 하루 묵혔다가 진행하세요'],
    },
    money: {
      title: '금전운', hanja: '財', accent: '#4ade80',
      headline: '버는 힘보다 지키는 규칙이 중요한 재물',
      summary:
        '금(金)이 재성으로 두 개 있어 관리형 재물에 강합니다. 다만 편재(유금) 성향이라 한 번에 크게 굴리는 방식보다, 정해진 규칙으로 꾸준히 쌓는 쪽이 체질에 맞습니다. 목돈은 "벌기"보다 "지키는 구조"를 먼저 세우는 편이 안전합니다.',
      strengths: ['새는 돈을 알아채는 감각', '고정 지출을 구조화하는 능력', '필요할 때를 위한 현금흐름 관리'],
      cautions: ['사람 좋아서 하는 지출이 반복됩니다', '변동성 큰 자산에 감정적으로 반응하기 쉽습니다', '보증·대여는 관계와 재물을 동시에 흔듭니다'],
      advice: ['수입의 일정 비율을 자동이체로 먼저 떼어 두세요', '투자 결정은 "규칙을 적고 나서" 실행하세요', '큰 지출 전 하루 대기 규칙이 특히 효과적입니다'],
    },
    health: {
      title: '건강운', hanja: '壽', accent: '#60a5fa',
      headline: '연료와 휴식, 두 가지가 함께 필요한 체질',
      summary:
        '부족한 화(火)·수(水)는 전통적으로 순환(체온·심혈관·수면)과 수분·호르몬 축으로 읽습니다. 일이 많을 때보다 "열을 내는 연료와 식히는 물"이 없을 때 지침이 오는 구조입니다. 50대에는 이 축이 실제 컨디션과 겹치는 영역이라 규칙이 특히 중요합니다.',
      strengths: ['증상이 오기 전에 몸의 신호를 먼저 감지하는 편', '한번 규칙을 만들면 오래 유지하는 힘'],
      cautions: ['갈증을 늦게 느껴 수분이 부족해지기 쉽습니다', '열을 내는 일에 몰입하면 회복을 뒤로 미룹니다', '수면 시간이 흔들리면 회복이 급격히 느려집니다'],
      advice: ['아침 햇빛 15분 — 화 기운과 생체리듬을 동시에', '물은 목마르기 전에 마시기 (하루 1.5L 이상)', '주 3회, 숨이 차는 유산소 20분 이상', '갱년기 관련 증상은 사주가 아니라 전문의 상담으로'],
    },
    job: {
      title: '취업운', hanja: '職', accent: '#a78bfa',
      headline: '재취업·이직은 "정리해서 넘기는 능력"으로 승부',
      summary:
        '관성(수)이 약한 사주라 조직의 규칙에 몸을 맞추는 데 에너지가 듭니다. 대신 인성(목)이 두 자리로 강해 기획·문서·교육·자문에서 신뢰를 얻습니다. 새 기술보다 "이미 쌓은 것을 구조화해 전달하는 역할"에서 문이 열립니다.',
      strengths: ['경험을 문서와 체계로 정리하는 힘', '사람을 가르치고 이끄는 신뢰', '끝까지 마무리하는 책임감'],
      cautions: ['연봉·조건 협상에서 스스로를 낮게 부릅니다', '새 환경의 암묵적 규칙에 적응하는 데 시간이 걸립니다', '인맥 관리가 소홀해지면 기회가 끊깁니다'],
      advice: ['경력기술서를 "역할-성과-수치"로 다시 쓰세요', '자문·강의·프로젝트 단위 계약을 먼저 시도하세요', '분기마다 지인 3명에게 근황을 전하세요'],
    },
    study: {
      title: '학업운', hanja: '學', accent: '#22d3ee',
      headline: '배움 자체가 운을 여는 구조',
      summary:
        '인성(목)이 용신이자 두 자리에 있어 학습이 곧 운의 연료입니다. 다만 화(집중·발산)가 얕아 오래 앉아 있는 공부보다 짧게 반복하는 방식이 맞습니다.',
      strengths: ['구조를 파악해 자기 언어로 바꾸는 이해력', '한 번 이해하면 오래 가는 기억'],
      cautions: ['완벽하게 이해할 때까지 시작을 미룹니다', '이론에 머물고 실습을 건너뜁니다'],
      advice: ['하루 25분 단위로 나눠 반복하세요', '배운 것을 한 장 요약으로 남기세요', '자격증·강의 중 하나를 골라 끝까지 마무리하세요'],
    },
  },
  p1975: {
    love: {
      title: '연애운', hanja: '緣', accent: '#f472b6',
      headline: '표현이 늦는 만큼 오해도 쌓입니다',
      summary:
        '을목(乙木)은 부드럽지만 뿌리가 질긴 목입니다. 마음이 깊고 한 번 정하면 오래 가지만, 화(火)가 하나도 없어 애정 표현의 통로가 비어 있습니다. 배우자 자리에 편관(酉金)이 앉아 관계에서 긴장감이나 주도권 다툼이 생기기 쉬운 구조입니다.',
      strengths: ['한 번 정한 사람에게 오래 가는 뿌리 깊은 애정', '드러내지 않아도 상대를 세심하게 챙기는 힘', '쉽게 흔들리지 않는 중심'],
      cautions: ['좋아해도 말이 늦어 상대가 확신을 못 갖습니다', '서운함을 쌓아 두다 한 번에 터집니다', '편관의 긴장이 관계를 각 세우게 만들 수 있습니다'],
      advice: ['하루 한 문장, 애정 표현을 규칙으로 만드세요', '서운함은 48시간 안에 꺼내는 원칙을 정하세요', '붉은 계열 소품·꽃·햇빛이 화 기운을 보완합니다'],
    },
    career: {
      title: '사업운', hanja: '業', accent: '#fbbf24',
      headline: '앞에서 소리 내기보다 구조를 잡는 자리',
      summary:
        '비겁(목)이 강해 독립심과 추진력이 있고, 편인(계수)이 전문성과 기획력을 더합니다. 반면 식상(화)이 없어 영업·발표·홍보처럼 앞에서 소리 내는 일은 소모가 큽니다. 혼자 깊이 파고들어 구조를 만드는 일 — 기획·감리·자문·정리 계열 — 에서 성과가 큽니다.',
      strengths: ['한 분야를 깊이 파는 전문성', '복잡한 것을 정리해 구조로 만드는 힘', '책임을 끝까지 지는 태도'],
      cautions: ['남의 일까지 떠안아 정작 자기 성과가 남지 않습니다', '완벽을 기다리다 시작이 늦습니다', '표현하지 않아 성과를 남이 가져갑니다'],
      advice: ['책임 범위를 문서로 명확히 하세요', '성과를 주기적으로 짧게 기록·공유하세요', '기획·자문·감리처럼 지식을 파는 형태와 궁합이 좋습니다'],
    },
    money: {
      title: '금전운', hanja: '財', accent: '#4ade80',
      headline: '버는 힘보다 새는 곳을 막는 싸움',
      summary:
        '재성(미토·기토)이 두 개로 갖춰져 있지만 목(비겁)이 네 개라 겁재가 강합니다. 돈이 들어와도 사람·관계·가족 쪽으로 새기 쉬운 구조로, 결국 수입 관리의 규칙이 재물의 크기를 결정합니다.',
      strengths: ['필요한 곳에 쓰는 절제', '생활비 구조를 파악하는 감각', '한번 정한 저축을 지키는 힘'],
      cautions: ['부탁을 거절하지 못해 새는 지출이 생깁니다', '가족·지인 관련 지출이 반복됩니다', '보증·대여에 취약합니다'],
      advice: ['수입의 일정 비율을 자동이체로 먼저 분리하세요', '지출 카테고리를 주 1회 점검하세요', '보증·대여는 원칙적으로 거절하는 규칙을 두세요'],
    },
    health: {
      title: '건강운', hanja: '壽', accent: '#60a5fa',
      headline: '순환과 배출이 과제인 체질',
      summary:
        '화(火)가 0이라 체온·순환·수면이 약하고, 목(木)이 과해 간·담·근육 긴장과 스트레스성 소화 불편으로 나타나기 쉽습니다. 50대에는 이 축이 갱년기 변화와 겹치므로 규칙이 특히 중요합니다.',
      strengths: ['몸의 신호를 일찍 감지하는 편', '한번 만든 규칙을 오래 유지하는 힘'],
      cautions: ['긴장이 근육과 소화로 먼저 나타납니다', '순환이 약해 손발이 차거나 잠이 얕습니다', '바쁘면 회복을 뒷전으로 미룹니다'],
      advice: ['아침 햇빛 15분', '주 3회 유산소 + 스트레칭으로 목의 긴장 풀기', '수면 시간을 고정하세요', '증상이 있으면 전문의 상담이 우선입니다'],
    },
    job: {
      title: '취업운', hanja: '職', accent: '#a78bfa',
      headline: '조직 안에서 "없으면 안 되는 자리"를 만드는 쪽',
      summary:
        '관성(금)이 용신이라 조직·직장의 틀이 오히려 이 사람을 다듬어 줍니다. 다만 하나뿐이라 경쟁이 치열한 자리보다 전문성이 인정받는 자리가 맞습니다. 비겁이 강해 주도권 다툼이 생기기 쉬우니 관계선 관리가 관건입니다.',
      strengths: ['한 분야를 깊이 파는 전문성', '맡은 일을 조용히 완수하는 힘'],
      cautions: ['성과를 말하지 않아 평가에서 밀립니다', '상사와의 긴장이 관계를 각 세웁니다', '남의 일까지 떠안습니다'],
      advice: ['월 1회 성과를 숫자로 정리해 보고하세요', '업무 범위를 문서로 확인하세요', '전문 자격·경력 인증을 하나 더 확보하세요'],
    },
    study: {
      title: '학업운', hanja: '學', accent: '#22d3ee',
      headline: '혼자 파고드는 공부에 강한 구조',
      summary:
        '인성(수)이 얇아 강의를 듣는 방식보다 스스로 파고들어 정리하는 쪽이 효율적입니다. 화(발산)가 없어 발표·구술처럼 순간 집중이 필요한 자리에는 대비가 필요합니다.',
      strengths: ['혼자 깊이 파고드는 집중력', '자기만의 방식으로 정리하는 힘'],
      cautions: ['발표·구술처럼 말로 꺼내는 평가에 약합니다', '진도 관리가 늦어지기 쉽습니다'],
      advice: ['배운 것을 소리 내어 설명하는 연습을 하세요', '주간 진도표를 눈에 보이는 곳에 두세요', '물을 곁에 두고 학습 리듬을 유지하세요'],
    },
  },
  p2005: {
    love: {
      title: '연애운', hanja: '緣', accent: '#f472b6',
      headline: '표현을 아끼는 만큼 상대가 확신을 못 갖습니다',
      summary:
        '기토(己土)는 논밭의 흙처럼 묵묵히 품는 일간입니다. 좋아해도 티를 잘 내지 않고, 인성(화)이 강해 머릿속으로만 관계를 정리하는 편입니다. 재성(수)이 하나도 없어 감정을 말로 꺼내는 연습이 특히 필요합니다.',
      strengths: ['한 사람을 오래 품는 안정감', '말보다 행동으로 챙기는 성실함', '쉽게 흔들리지 않는 중심'],
      cautions: ['호감을 표현하지 않아 친구로 남기 쉽습니다', '속으로 결론을 내리고 상대에게 확인하지 않습니다', '토가 과해 고집으로 보일 수 있습니다'],
      advice: ['호감은 한 문장으로 먼저 말해 보세요', '추측 대신 질문으로 확인하는 습관을 들이세요', '물·파란색 계열이 수 기운을 보완합니다'],
    },
    career: {
      title: '사업운', hanja: '業', accent: '#fbbf24',
      headline: '기술과 자격이 곧 무기가 되는 구조',
      summary:
        '식상(경금·유금)이 두 개로 실무 감각과 기술 습득이 빠르고, 인성(병화)이 배운 것을 구조화합니다. 편관(을목)이 하나 있어 조직 안에서 책임을 맡는 힘도 있습니다. 20대에 쌓은 스펙만큼 30대 이후 속도가 붙는 사주입니다.',
      strengths: ['손에 잡히는 기술을 빨리 익히는 힘', '배운 것을 체계로 정리하는 능력', '맡은 일을 끝까지 해내는 책임감'],
      cautions: ['완벽을 기다리다 시작이 늦습니다', '비교와 조급함이 방향을 흔듭니다', '혼자 다 하려다 협업 기회를 놓칩니다'],
      advice: ['자격증·포트폴리오처럼 남는 결과물을 만드세요', '작은 프로젝트를 끝까지 완성한 경험이 가장 큰 자산입니다', '선배·상사에게 피드백을 짧게 자주 요청하세요'],
    },
    money: {
      title: '금전운', hanja: '財', accent: '#4ade80',
      headline: '재성이 비어 있어 규칙을 먼저 배워야 하는 재물',
      summary:
        '수(水)가 하나도 없어 재성의 그릇이 비어 있는 구조입니다. 버는 능력보다 관리하는 습관이 늦게 자리 잡기 쉬워, 20대에 만든 소비 습관이 평생 재물의 크기를 좌우합니다.',
      strengths: ['필요한 곳에만 쓰는 절제', '한번 규칙을 만들면 지키는 힘'],
      cautions: ['또래 소비 흐름에 휩쓸리기 쉽습니다', '첫 수입이 생기면 지출이 먼저 늘어납니다', '큰 지출을 즉흥적으로 결정합니다'],
      advice: ['첫 월급부터 자동이체로 20% 먼저 떼어 두세요', '고정비와 변동비를 분리해 기록하세요', '물·파란색 소품, 수영·물 마시기로 수 기운을 보완하세요'],
    },
    health: {
      title: '건강운', hanja: '壽', accent: '#60a5fa',
      headline: '수분과 소화, 두 축을 함께 봐야 합니다',
      summary:
        '수(水)가 0이라 수분·신장·호르몬 축이 약하고, 토(土)가 세 개로 과해 소화기 부담과 체중 변화가 나타나기 쉽습니다. 20대의 생활 습관이 30대 이후 컨디션의 바닥을 만듭니다.',
      strengths: ['체력의 기본 바탕이 단단한 편', '규칙을 만들면 오래 유지하는 힘'],
      cautions: ['물을 거의 마시지 않습니다', '야식·탄수화물 위주 식사가 소화를 힘들게 합니다', '수면 시간이 불규칙합니다'],
      advice: ['하루 1.5L 이상 물 마시기', '야식을 줄이고 식사 시간을 고정하세요', '주 3회 유산소로 땀 흘리기', '증상이 있으면 전문의 상담이 우선입니다'],
    },
    job: {
      title: '취업운', hanja: '職', accent: '#a78bfa',
      headline: '스펙보다 "손에 잡히는 결과물"이 여는 문',
      summary:
        '관성(목)이 용신이자 하나뿐이라 조직 생활의 틀이 이 사람을 단단하게 만듭니다. 식상(금)이 두 개로 실무·기술 습득이 빠르고, 편관이 있어 책임을 맡으면 오히려 성장합니다. 20대 취업은 자격·포트폴리오 같은 증거물이 결정적입니다.',
      strengths: ['기술을 빨리 익히는 손', '맡은 일을 끝까지 해내는 책임감', '현장에서 통하는 실무 감각'],
      cautions: ['완벽을 기다리다 지원 시기를 놓칩니다', '눈앞의 일에 몰입해 방향 점검이 늦습니다', '첫 직장의 조건만 보고 판단합니다'],
      advice: ['"완성" 전에 지원하고 피드백을 받으세요', '포트폴리오를 3개 프로젝트로 압축하세요', '선배 3명에게 실제 업무를 물어보세요'],
    },
    study: {
      title: '학업운', hanja: '學', accent: '#22d3ee',
      headline: '이해는 빠른데 꾸준함이 관건',
      summary:
        '인성(화)이 두 개로 이해력과 흡수력이 좋습니다. 다만 토가 세 개로 과해 한 번 지치면 회복이 느리고, 수가 없어 밤샘 뒤 컨디션 회복이 더딥니다. 실력은 "짧게 자주"에서 나옵니다.',
      strengths: ['개념을 빠르게 흡수하는 이해력', '배운 것을 응용하는 감각'],
      cautions: ['벼락치기 후 긴 공백이 생깁니다', '밤샘이 다음 주 전체를 망칩니다', '목표가 흐려지면 금방 흥미를 잃습니다'],
      advice: ['하루 2시간 고정 루틴을 먼저 만드세요', '시험 2주 전 계획표를 눈에 붙이세요', '물 1.5L와 수면 7시간을 성적의 일부로 보세요'],
    },
  },
}

/* -------------------------------------------------------- 계산 함수들 */
function yearGanzhi(year) {
  const s = (((year - 4) % 10) + 10) % 10
  const b = (((year - 4) % 12) + 12) % 12
  return {
    year,
    stem: STEMS[s], stemHanja: STEMS_HANJA[s], stemEl: STEM_EL[s],
    branch: BRANCHES[b], branchHanja: BRANCHES_HANJA[b], branchEl: BRANCH_EL[b],
    label: STEMS[s] + BRANCHES[b],
    hanja: STEMS_HANJA[s] + BRANCHES_HANJA[b],
  }
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

function buildPerson(cfg) {
  const INPUT = { birthDate: cfg.solar, birthTime: cfg.time, calendar: 'solar', gender: cfg.gender }
  const saju = analyzeSaju(INPUT, { analysisType: 'fortune', fortuneType: 'general', targetYear: START_YEAR })
  const daeunRaw = callSajuTool('get_dae_un', { ...INPUT })

  const counts = saju.fiveElements
  const yong1 = saju.yongsin.primary
  const yong2 = saju.yongsin.secondary
  const dayEl = saju.dayMaster.element
  const outputEl = GENERATES[dayEl] // 식상
  const wealthEl = CONTROLS[dayEl] // 재성
  const controlEl = CONTROLLED_BY[dayEl] // 관성(일간을 극함)

  /* 오행 기본값 — 사람마다 용신·십성 구조가 달라 자동 산출 */
  const elementBase = {}
  for (const el of Object.keys(EL_KO)) {
    let value = 0
    let reason = '중립'
    if (el === yong1) { value = 10; reason = '용신(1순위)' }
    else if (el === yong2) { value = 8; reason = '희신(2순위) · 부족 보완' }
    else if (el === wealthEl) { value = 2; reason = '재성 — 재물의 그릇' }
    else if (el === outputEl) { value = -2; reason = '식상 과다 — 설기 소모' }
    else if (el === controlEl) { value = -5; reason = '구신 — 일간을 극함' }
    else if (el === dayEl && counts[el] >= 3) { value = -2; reason = '비겁 과다 — 에너지 분산' }
    elementBase[el] = { value, reason, count: counts[el] }
  }

  /* 대운 구간 */
  const birthYear = Number(cfg.solar.slice(0, 4))
  const daeun = daeunRaw.cycles.map((c, i, arr) => {
    const from = birthYear + c.age
    const to = (arr[i + 1] ? birthYear + arr[i + 1].age : from + 10) - 1
    const stemEl = STEM_EL[STEMS.indexOf(c.label[0])]
    const branchEl = BRANCH_EL[BRANCHES.indexOf(c.label[1])]
    let delta = 0
    if ([stemEl, branchEl].some((e) => e === yong1 || e === yong2)) delta += 3
    else if ([stemEl, branchEl].some((e) => e === controlEl)) delta -= 2
    return { age: c.age, from, to, label: c.label, hanja: c.hanja, stemEl, branchEl, delta }
  })
  const daeunOf = (year) => daeun.find((d) => year >= d.from && year <= d.to) || daeun[daeun.length - 1]

  /* 연도별 점수 */
  const ROLES = roleMap(dayEl)
  function scoreYear(year) {
    const gz = yearGanzhi(year)
    const d = daeunOf(year)
    const scores = {}
    for (const dim of DIM_KEYS) {
      const w = ROLE_WEIGHTS[dim]
      const raw =
        elementBase[gz.stemEl].value * w[ROLES[gz.stemEl]] +
        elementBase[gz.branchEl].value * 0.8 * w[ROLES[gz.branchEl]]
      scores[dim] = Math.round(clamp(50 + raw * 1.6 + d.delta, 15, 97))
    }
    scores.overall = Math.round(DIM_KEYS.reduce((s, k) => s + scores[k], 0) / DIM_KEYS.length)
    return { ...gz, daeun: d.label, scores }
  }

  const yearly = Array.from({ length: SPAN }, (_, i) => scoreYear(START_YEAR + i))

  const buckets = []
  for (let i = 0; i < SPAN; i += 5) {
    const slice = yearly.slice(i, i + 5)
    const avg = (k) => Math.round(slice.reduce((s, y) => s + y.scores[k], 0) / slice.length)
    const best = slice.reduce((a, b) => (b.scores.overall > a.scores.overall ? b : a))
    const bucketScores = { overall: avg('overall') }
    for (const k of DIM_KEYS) bucketScores[k] = avg(k)
    buckets.push({
      label: `${slice[0].year}–${slice[slice.length - 1].year}`,
      from: slice[0].year,
      to: slice[slice.length - 1].year,
      daeun: daeunOf(slice[0].year).label,
      daeunHanja: daeunOf(slice[0].year).hanja,
      scores: bucketScores,
      bestYear: best.year,
      bestScore: best.scores.overall,
      years: slice.map((y) => ({ year: y.year, label: y.label, scores: y.scores })),
    })
  }

  /* 사주 기둥 */
  const posKo = { year: '연주', month: '월주', day: '일주', hour: '시주' }
  const pillars = ['year', 'month', 'day', 'hour'].map((k) => {
    const p = saju.pillars[k]
    if (!p) return { pos: posKo[k], empty: true }
    return {
      pos: posKo[k], label: p.label, hanja: p.hanja,
      stem: p.stem, stemHanja: p.stemHanja, stemEl: p.stemElement, stemKo: p.stemElementKo,
      branch: p.branch, branchHanja: p.branchHanja, branchEl: p.branchElement, branchKo: p.branchElementKo,
      animal: p.branchAnimal, yinYang: p.yinYang,
    }
  })

  /* 주제 콘텐츠에 현재 점수 주입 */
  const t = TOPICS[cfg.id]
  const topics = {}
  for (const key of DIM_KEYS) {
    topics[key] = { ...t[key], key, score: yearly[0].scores[key] }
  }

  const curDaeun = daeunOf(START_YEAR)
  const peak = yearly.reduce((a, b) => (b.scores.overall > a.scores.overall ? b : a))

  return {
    id: cfg.id,
    label: cfg.label,
    relation: cfg.relation,
    subject: {
      name: cfg.name, lunar: cfg.lunar, solar: cfg.solar, time: cfg.time,
      timeLabel: cfg.timeLabel, gender: cfg.gender, genderKo: cfg.genderKo,
      birthCity: cfg.birthCity, conversion: cfg.conversion, timeNote: cfg.timeNote,
    },
    pillars,
    dayMaster: saju.dayMaster,
    fiveElements: saju.fiveElements,
    dominantElements: saju.dominantElements,
    weakElements: saju.weakElements,
    yongsin: saju.yongsin,
    scoreModel: { elementBase },
    daeun,
    currentDaeun: curDaeun,
    buckets,
    yearly,
    peakYear: { year: peak.year, label: peak.label, score: peak.scores.overall },
    topics,
  }
}

/* -------------------------------------------------------------- 출력 */
const people = PEOPLE.map(buildPerson)

const data = {
  meta: {
    generatedAt: new Date().toISOString(),
    engine: 'saju-fortune (npm) — 로컬 계산, MCP 미사용',
    disclaimer:
      '이 페이지는 전통 해석에 기반한 참고 자료입니다. 의료·투자·법률 판단을 대신하지 않으며, 점수는 길흉의 확정이 아니라 상대적 흐름을 보여 주는 지표입니다.',
    formula: '연도점수 = 50 + (천간값×w + 지지값×0.8×w)×1.6 + 대운보정',
    aggregation: '5년 구간 점수 = 해당 구간 연도 점수의 평균 · 종합 = 6개 주제의 평균',
    weights: ROLE_WEIGHTS,
    roleLabels: { peer: '비겁', output: '식상', wealth: '재성', officer: '관성', resource: '인성' },
  },
  people,
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
for (const p of people) {
  console.log(`\n[${p.label}] ${p.subject.solar} ${p.subject.time} ${p.subject.genderKo}`)
  console.log('  pillars:', p.pillars.map((x) => x.label || '-').join(' '), '| 일간:', p.dayMaster.stem)
  console.log('  오행:', JSON.stringify(p.fiveElements), '| 용신:', p.yongsin.primaryKo)
  console.log('  대운:', p.daeun.slice(0, 4).map((d) => `${d.from}-${d.to} ${d.label}`).join(' | '))
  for (const b of p.buckets) {
    const s = b.scores
    console.log(
      `    ${b.label} 대운 ${b.daeun} 종합 ${s.overall} ` +
        `(연애 ${s.love} 취업 ${s.job} 사업 ${s.career} 금전 ${s.money} 학업 ${s.study} 건강 ${s.health})`
    )
  }
}
