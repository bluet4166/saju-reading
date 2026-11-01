/* ============================================================
   사주 대시보드 — 렌더링 (멀티 인물)
   data.js 가 생성한 window.SAJU_DATA 를 읽어 화면을 그린다.
   외부 라이브러리 없음 (차트는 직접 SVG 로 생성)
   ============================================================ */
(() => {
  'use strict'

  const D = window.SAJU_DATA
  if (!D || !D.people || !D.people.length) return

  const PEOPLE = D.people
  let current = 0
  const P = () => PEOPLE[current]

  const DIMS = [
    { key: 'love', label: '연애운', raw: '#f472b6' },
    { key: 'career', label: '사업운', raw: '#fbbf24' },
    { key: 'money', label: '금전운', raw: '#4ade80' },
    { key: 'health', label: '건강운', raw: '#60a5fa' },
  ]
  const EL_KO = { wood: '목', fire: '화', earth: '토', metal: '금', water: '수' }
  const EL_HANJA = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' }
  const EL_VAR = { wood: 'var(--wood)', fire: 'var(--fire)', earth: 'var(--earth)', metal: 'var(--metal)', water: 'var(--water)' }
  const STRENGTH_KO = { strong: '신강', weak: '신약', balanced: '중화' }
  const NS = 'http://www.w3.org/2000/svg'

  const $ = (sel, root = document) => root.querySelector(sel)
  const svgEl = (tag, attrs = {}) => {
    const n = document.createElementNS(NS, tag)
    for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v)
    return n
  }

  const visible = { love: true, career: true, money: true, health: true }

  /* --------------------------------------------------- 인물 전환 */

  function renderPeopleSwitch() {
    const host = $('#peopleSwitch')
    host.innerHTML = PEOPLE.map(
      (p, i) => `
      <button type="button" role="tab" data-idx="${i}" aria-selected="${i === current}"
              tabindex="${i === current ? 0 : -1}">
        <span class="ps-relation">${p.relation}</span>
        <span class="ps-label">${p.label}</span>
        <span class="ps-sub">${p.subject.solar} ${p.subject.time}</span>
      </button>`
    ).join('')

    const btns = [...host.querySelectorAll('button')]
    const select = (idx) => {
      current = idx
      btns.forEach((b, i) => {
        b.setAttribute('aria-selected', String(i === idx))
        b.tabIndex = i === idx ? 0 : -1
      })
      renderAll()
      btns[idx].focus()
    }
    btns.forEach((b, i) => {
      b.addEventListener('click', () => select(i))
      b.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % btns.length) }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + btns.length) % btns.length) }
      })
    })
  }

  /* ------------------------------------------------------- 상단 정보 */

  function renderHero() {
    const p = P()
    const s = p.subject

    document.title = `사주 대시보드 · ${s.solar} ${p.pillars[2].label}일주`

    const chips = [
      ['생년월일', `${s.lunar} → 양력 ${s.solar}`],
      ['시각', `${s.time} · ${s.timeLabel}`],
      ['성별', s.genderKo],
      ['일주', `${p.pillars[2].label} (${p.pillars[2].hanja})`],
      ['용신', `${p.yongsin.primaryKo} · ${p.yongsin.secondaryKo}`],
    ]
    $('#subjectChips').innerHTML = chips.map(([k, v]) => `<li><b>${k}</b> ${v}</li>`).join('')

    const y2026 = p.yearly[0]
    $('#heroScore').textContent = y2026.scores.overall
    $('#heroNote').textContent =
      `${s.solar} ${s.time}생 · 올해는 ${y2026.label}년, ${p.currentDaeun.label} 대운 안에 있습니다. ` +
      `앞으로 25년 중 가장 밝은 해는 ${p.peakYear.year}년(${p.peakYear.label}) ${p.peakYear.score}점입니다.`
  }

  /* --------------------------------------------------------- 사주팔자 */

  function renderPillars() {
    const p = P()
    $('#pillars').innerHTML = p.pillars
      .map((pl, i) => {
        if (pl.empty) {
          return `<article class="pillar is-empty">
            <span class="pillar-pos">${pl.pos}</span>
            <span class="pillar-hanja" style="opacity:.3">–</span>
            <p class="pillar-ko">시각 미상</p>
            <div class="pillar-meta"><span>계산 제외</span></div>
          </article>`
        }
        return `
        <article class="pillar${i === 2 ? ' is-day' : ''}">
          <span class="pillar-pos">${pl.pos}</span>
          <span class="pillar-hanja">
            <span class="stem">${pl.stemHanja}</span><span class="branch">${pl.branchHanja}</span>
          </span>
          <p class="pillar-ko">${pl.label}</p>
          <div class="pillar-meta">
            <span style="color:${EL_VAR[pl.stemEl]}">${EL_KO[pl.stemEl]}</span>
            <span style="color:${EL_VAR[pl.branchEl]}">${EL_KO[pl.branchEl]}</span>
            <span>${pl.animal}</span>
          </div>
        </article>`
      })
      .join('')

    const dm = p.dayMaster
    $('#dayMasterNote').textContent =
      `일간은 ${dm.stem}(${dm.elementKo}) · ${dm.yinYang === 'yin' ? '음' : '양'}${dm.elementKo} · ${STRENGTH_KO[dm.strength] || dm.strength}`

    $('#conversionNote').textContent =
      `음력 ${p.subject.lunar} → 양력 ${p.subject.solar} 변환: ${p.subject.conversion}. ${p.subject.timeNote}`
  }

  /* --------------------------------------------------------- 오행 분포 */

  function renderElements() {
    const p = P()
    const order = ['wood', 'fire', 'earth', 'metal', 'water']
    const max = Math.max(...Object.values(p.fiveElements), 1)
    $('#elements').innerHTML = order
      .map((el) => {
        const n = p.fiveElements[el]
        const weak = p.weakElements.includes(el)
        const strong = p.dominantElements.includes(el)
        return `
          <div class="el-row${weak ? ' is-weak' : ''}${strong ? ' is-strong' : ''}">
            <span class="el-name">${EL_KO[el]} ${EL_HANJA[el]}</span>
            <div class="el-bar">
              <div class="el-fill" style="width:${(n / max) * 100}%;background:${EL_VAR[el]}"></div>
            </div>
            <span class="el-count">${n}</span>
          </div>`
      })
      .join('')

    const weak = p.weakElements.map((e) => EL_KO[e]).join('·')
    const strong = p.dominantElements.map((e) => EL_KO[e]).join('·')
    $('#yongsinNote').textContent =
      `강한 기운 ${strong} · 부족한 기운 ${weak} → 조율점(용신) ${p.yongsin.primaryKo}, 보조 ${p.yongsin.secondaryKo}`
  }

  /* ------------------------------------------------------- 공용 스케일 */

  function makeScale(domain, range) {
    const [d0, d1] = domain
    const [r0, r1] = range
    return (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0)
  }

  function yDomain() {
    const all = P().yearly.flatMap((y) => Object.values(y.scores))
    const min = Math.min(...all)
    const max = Math.max(...all)
    return [Math.max(10, Math.floor((min - 8) / 10) * 10), Math.min(100, Math.ceil((max + 8) / 10) * 10)]
  }

  function tooltipAt(tip, host, vbX, vbY, html, vbW = 920) {
    tip.innerHTML = html
    tip.hidden = false
    const rect = host.getBoundingClientRect()
    const k = rect.width / vbW
    const x = vbX * k
    const y = vbY * k
    const w = tip.offsetWidth
    let left = x - w / 2
    left = Math.max(8, Math.min(left, rect.width - w - 8))
    tip.style.left = `${left}px`
    tip.style.top = `${Math.max(tip.offsetHeight + 6, y - 10)}px`
  }

  /* --------------------------------------------------- 5년 단위 차트 */

  function renderLegend() {
    $('#legend').innerHTML = DIMS.map(
      (d) => `
      <button type="button" data-dim="${d.key}" aria-pressed="${visible[d.key]}">
        <span class="swatch" style="--c:${d.raw}"></span>${d.label}
      </button>`
    ).join('')

    $('#legend').querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const k = btn.dataset.dim
        visible[k] = !visible[k]
        btn.setAttribute('aria-pressed', String(visible[k]))
        renderBucketChart()
        renderYearChart()
      })
    })
  }

  function renderBucketChart() {
    const p = P()
    const svg = $('#bucketChart')
    svg.innerHTML = ''
    const W = 920, H = 400
    const pad = { t: 46, r: 16, b: 66, l: 44 }
    const innerW = W - pad.l - pad.r
    const innerH = H - pad.t - pad.b
    const [d0, d1] = yDomain()
    const y = makeScale([d0, d1], [pad.t + innerH, pad.t])
    const n = p.buckets.length
    const band = innerW / n
    const activeDims = DIMS.filter((d) => visible[d.key])
    const barW = Math.min(24, (band * 0.62) / Math.max(activeDims.length, 1))

    for (let v = d0; v <= d1; v += 10) {
      svg.appendChild(svgEl('line', { class: 'grid-line', x1: pad.l, x2: W - pad.r, y1: y(v), y2: y(v) }))
      const t = svgEl('text', { x: pad.l - 10, y: y(v) + 4, 'text-anchor': 'end' })
      t.textContent = v
      svg.appendChild(t)
    }
    svg.appendChild(svgEl('line', { class: 'axis-line', x1: pad.l, x2: W - pad.r, y1: pad.t + innerH, y2: pad.t + innerH }))

    const currentIdx = p.buckets.findIndex((b) => 2026 >= b.from && 2026 <= b.to)

    p.buckets.forEach((b, i) => {
      const cx = pad.l + band * i + band / 2
      if (i === currentIdx) {
        svg.appendChild(svgEl('rect', {
          x: pad.l + band * i + 3, y: pad.t - 22, width: band - 6, height: innerH + 22,
          rx: 10, fill: 'rgba(217,179,108,0.06)',
        }))
      }

      const dl = svgEl('text', { class: 'daeun-label', x: cx, y: pad.t - 26, 'text-anchor': 'middle' })
      dl.textContent = `대운 ${b.daeun}`
      svg.appendChild(dl)

      const groupW = barW * activeDims.length + 6 * (activeDims.length - 1)
      let bx = cx - groupW / 2

      activeDims.forEach((d) => {
        const v = b.scores[d.key]
        const top = y(v)
        const h = Math.max(2, pad.t + innerH - top)
        svg.appendChild(svgEl('rect', {
          class: 'bar', x: bx, y: top, width: barW, height: h, rx: 4,
          fill: d.raw, opacity: 0.72,
        }))

        const hit = svgEl('rect', { class: 'bar-hit', x: bx - 3, y: pad.t, width: barW + 6, height: innerH })
        hit.addEventListener('mouseenter', () => showBucketTip(i, cx, y(b.scores.overall)))
        hit.addEventListener('mouseleave', hideTips)
        svg.appendChild(hit)

        const lbl = svgEl('text', {
          x: bx + barW / 2, y: top - 7, 'text-anchor': 'middle',
          style: `fill:${d.raw};font-size:10.5px;opacity:.85`,
        })
        lbl.textContent = v
        svg.appendChild(lbl)

        bx += barW + 6
      })

      const xl = svgEl('text', { x: cx, y: pad.t + innerH + 24, 'text-anchor': 'middle', style: 'fill:var(--ink-dim)' })
      xl.textContent = b.label
      svg.appendChild(xl)

      const sl = svgEl('text', { x: cx, y: pad.t + innerH + 42, 'text-anchor': 'middle' })
      sl.textContent = `최고 ${b.bestYear}`
      svg.appendChild(sl)
    })

    const pts = p.buckets.map((b, i) => [pad.l + band * i + band / 2, y(b.scores.overall)])
    svg.appendChild(svgEl('polyline', {
      class: 'series-line',
      points: pts.map((pt) => pt.join(',')).join(' '),
      stroke: 'var(--gold)', 'stroke-width': 2,
    }))
    pts.forEach(([px, py]) => {
      svg.appendChild(svgEl('circle', { class: 'series-dot', cx: px, cy: py, r: 4, fill: 'var(--gold)' }))
    })
  }

  function showBucketTip(i, x, yPos) {
    const b = P().buckets[i]
    const host = $('#bucketChart').closest('.chart-shell')
    const rows = DIMS.map(
      (d) => `<div class="tt-row"><span>${d.label}</span><b style="color:${d.raw}">${b.scores[d.key]}</b></div>`
    ).join('')
    tooltipAt($('#tooltip'), host, x, yPos, `
      <strong>${b.label}</strong>
      <div class="tt-row"><span>대운</span><b>${b.daeun} (${b.daeunHanja})</b></div>
      ${rows}
      <div class="tt-row" style="margin-top:6px;border-top:1px solid rgba(255,255,255,.12);padding-top:6px">
        <span>종합</span><b style="color:var(--gold)">${b.scores.overall}</b>
      </div>`)
  }

  function hideTips() {
    $('#tooltip').hidden = true
    $('#tooltipYear').hidden = true
  }

  /* --------------------------------------------------------- 표 */

  function renderBucketTable() {
    const p = P()
    $('#bucketTable').innerHTML = p.buckets
      .map((b) => {
        const cur = 2026 >= b.from && 2026 <= b.to
        return `<tr class="${cur ? 'is-current' : ''}">
          <td>${b.label}${cur ? ' <span class="daeun-pill" style="background:rgba(217,179,108,.18);color:var(--gold)">현재</span>' : ''}</td>
          <td><span class="daeun-pill">${b.daeun}</span></td>
          <td>${b.scores.love}</td>
          <td>${b.scores.career}</td>
          <td>${b.scores.money}</td>
          <td>${b.scores.health}</td>
          <td class="total">${b.scores.overall}</td>
        </tr>`
      })
      .join('')

    $('#chartRange').textContent = `${p.buckets[0].from}–${p.buckets[p.buckets.length - 1].to}`
  }

  /* --------------------------------------------------- 연도별 차트 */

  function renderYearChart() {
    const p = P()
    const svg = $('#yearChart')
    svg.innerHTML = ''
    const W = 920, H = 360
    const pad = { t: 34, r: 16, b: 52, l: 44 }
    const innerW = W - pad.l - pad.r
    const innerH = H - pad.t - pad.b
    const [d0, d1] = yDomain()
    const y = makeScale([d0, d1], [pad.t + innerH, pad.t])
    const years = p.yearly
    const stepX = innerW / (years.length - 1)
    const x = (i) => pad.l + stepX * i

    p.daeun.forEach((dn) => {
      const idxs = years.map((yr, i) => ({ yr, i })).filter((o) => o.yr.year >= dn.from && o.yr.year <= dn.to)
      if (!idxs.length) return
      const x0 = x(idxs[0].i) - stepX / 2
      const x1 = x(idxs[idxs.length - 1].i) + stepX / 2
      const left = Math.max(pad.l, x0)
      const right = Math.min(W - pad.r, x1)
      svg.appendChild(svgEl('rect', { class: 'daeun-band', x: left, y: pad.t, width: right - left, height: innerH }))
      const t = svgEl('text', {
        class: 'daeun-label', x: (left + right) / 2, y: pad.t + 13, 'text-anchor': 'middle',
      })
      t.textContent = `대운 ${dn.label} (${dn.from}–${dn.to})`
      svg.appendChild(t)
      if (x0 > pad.l) {
        svg.appendChild(svgEl('line', { class: 'band-line', x1: x0, x2: x0, y1: pad.t, y2: pad.t + innerH }))
      }
    })

    for (let v = d0; v <= d1; v += 10) {
      svg.appendChild(svgEl('line', { class: 'grid-line', x1: pad.l, x2: W - pad.r, y1: y(v), y2: y(v) }))
      const t = svgEl('text', { x: pad.l - 10, y: y(v) + 4, 'text-anchor': 'end' })
      t.textContent = v
      svg.appendChild(t)
    }
    svg.appendChild(svgEl('line', { class: 'axis-line', x1: pad.l, x2: W - pad.r, y1: pad.t + innerH, y2: pad.t + innerH }))

    years.forEach((yr, i) => {
      if (yr.year % 5 === 1 || i === 0) {
        const t = svgEl('text', { x: x(i), y: pad.t + innerH + 22, 'text-anchor': 'middle' })
        t.textContent = yr.year
        svg.appendChild(t)
      }
    })

    const todayIdx = years.findIndex((yy) => yy.year === 2026)
    if (todayIdx >= 0) {
      svg.appendChild(svgEl('line', {
        class: 'today-line', x1: x(todayIdx), x2: x(todayIdx), y1: pad.t - 6, y2: pad.t + innerH,
      }))
      const tl = svgEl('text', { class: 'today-label', x: x(todayIdx) + 5, y: pad.t + 8 })
      tl.textContent = '지금'
      svg.appendChild(tl)
    }

    DIMS.filter((d) => visible[d.key]).forEach((d) => {
      const pts = years.map((yy, i) => [x(i), y(yy.scores[d.key])])
      svg.appendChild(svgEl('polyline', {
        class: 'series-line',
        points: pts.map((pt) => pt.join(',')).join(' '),
        stroke: d.raw, opacity: 0.92,
      }))
      pts.forEach(([px, py]) => {
        svg.appendChild(svgEl('circle', { class: 'series-dot', cx: px, cy: py, r: 2.6, fill: d.raw }))
      })
    })

    years.forEach((yy, i) => {
      const hit = svgEl('rect', {
        x: x(i) - stepX / 2, y: pad.t, width: stepX, height: innerH,
        fill: 'transparent', style: 'cursor:pointer',
      })
      hit.addEventListener('mouseenter', () => {
        const rows = DIMS.map(
          (d) => `<div class="tt-row"><span>${d.label}</span><b style="color:${d.raw}">${yy.scores[d.key]}</b></div>`
        ).join('')
        tooltipAt($('#tooltipYear'), $('#yearChart').closest('.chart-shell'),
          x(i), y(yy.scores.overall), `
          <strong>${yy.year}년 ${yy.label} (${yy.hanja})</strong>
          <div class="tt-row"><span>대운</span><b>${yy.daeun}</b></div>
          ${rows}
          <div class="tt-row" style="margin-top:6px;border-top:1px solid rgba(255,255,255,.12);padding-top:6px">
            <span>종합</span><b style="color:var(--gold)">${yy.scores.overall}</b>
          </div>`)
      })
      hit.addEventListener('mouseleave', hideTips)
      svg.appendChild(hit)
    })

    const best = years.reduce((a, b) => (b.scores.overall > a.scores.overall ? b : a))
    const worst = years.reduce((a, b) => (b.scores.overall < a.scores.overall ? b : a))
    $('#yearHint').textContent =
      `가장 흐름이 좋은 해는 ${best.year}년(${best.label}) ${best.scores.overall}점, ` +
      `가장 지치는 해는 ${worst.year}년(${worst.label}) ${worst.scores.overall}점입니다. ` +
      `낮은 해는 "나쁜 해"가 아니라 회복이 필요한 해로 읽으시면 됩니다.`
  }

  /* ------------------------------------------------------- 세부 운세 */

  function renderTopics() {
    const p = P()
    const topics = ['love', 'career', 'money', 'health'].map((k) => p.topics[k])

    $('#tabs').innerHTML = topics
      .map(
        (t, i) => `<button type="button" role="tab" id="tab-${t.key}"
          aria-controls="panel-${t.key}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
          ${t.title}</button>`
      )
      .join('')

    $('#topicPanels').innerHTML = topics
      .map(
        (t, i) => `
        <div class="panel" id="panel-${t.key}" role="tabpanel" aria-labelledby="tab-${t.key}"
             style="--c:${t.accent}" ${i === 0 ? '' : 'hidden'}>
          <div class="panel-head">
            <div>
              <h3 class="panel-title">${t.title} <span class="hanja">${t.hanja}</span></h3>
              <p class="panel-headline">${t.headline}</p>
            </div>
            <div class="score-dial">
              <span class="hs-label">2026</span>
              <div class="dial-track"><div class="dial-fill" style="width:${t.score}%"></div></div>
              <span class="dial-value">${t.score}</span>
            </div>
          </div>

          <p class="panel-summary">${t.summary}</p>

          <div class="panel-grid">
            <div class="mini good"><h4>강점</h4><ul>${t.strengths.map((s) => `<li>${s}</li>`).join('')}</ul></div>
            <div class="mini warn"><h4>주의</h4><ul>${t.cautions.map((s) => `<li>${s}</li>`).join('')}</ul></div>
            <div class="mini tip"><h4>실천</h4><ul>${t.advice.map((s) => `<li>${s}</li>`).join('')}</ul></div>
          </div>
        </div>`
      )
      .join('')

    const buttons = [...$('#tabs').querySelectorAll('button')]
    const select = (idx) => {
      buttons.forEach((b, i) => {
        const on = i === idx
        b.setAttribute('aria-selected', String(on))
        b.tabIndex = on ? 0 : -1
        const panel = document.getElementById(b.getAttribute('aria-controls'))
        if (panel) panel.hidden = !on
      })
      buttons[idx].focus()
    }
    buttons.forEach((b, i) => {
      b.addEventListener('click', () => select(i))
      b.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % buttons.length) }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + buttons.length) % buttons.length) }
      })
    })
  }

  /* ------------------------------------------------------- 산출 방식 */

  function renderMethod() {
    const p = P()
    const base = p.scoreModel.elementBase
    const rows = ['wood', 'fire', 'earth', 'metal', 'water']
      .map((el) => `<tr>
        <td>${EL_KO[el]} (${EL_HANJA[el]})</td>
        <td>${p.fiveElements[el]}개</td>
        <td><b style="color:${base[el].value >= 0 ? 'var(--el-ok)' : 'var(--el-no)'}">${base[el].value > 0 ? '+' : ''}${base[el].value}</b></td>
        <td>${base[el].reason}</td>
      </tr>`)
      .join('')

    $('#methodBody').innerHTML = `
      <p><code>${D.meta.formula}</code></p>
      <p>${D.meta.aggregation}. 대운 보정은 대운 간지가 용신·희신이면 +3, 구신이면 −2입니다.</p>
      <table class="model-table">
        <thead><tr><th>오행</th><th>개수</th><th>기본값</th><th>근거</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p>주제별 가중치 <code>w</code>는 연애(화 1.3) · 사업(금 1.2) · 금전(금 1.5) · 건강(수 1.3)처럼
      각 영역이 민감한 오행에 더 큰 값을 줍니다. 따라서 같은 해라도 네 점수가 서로 다르게 나옵니다.</p>`

    $('#disclaimer').textContent = D.meta.disclaimer
    $('#footerMeta').textContent =
      `엔진: ${D.meta.engine} · 생성 ${new Date(D.meta.generatedAt).toLocaleString('ko-KR')}`
  }

  /* ------------------------------------------------------------ 실행 */

  function renderAll() {
    renderHero()
    renderPillars()
    renderElements()
    renderBucketChart()
    renderBucketTable()
    renderYearChart()
    renderTopics()
    renderMethod()
  }

  renderPeopleSwitch()
  renderLegend()
  renderAll()

  let rt
  window.addEventListener('resize', () => {
    clearTimeout(rt)
    rt = setTimeout(() => { renderBucketChart(); renderYearChart() }, 180)
  })
})()
