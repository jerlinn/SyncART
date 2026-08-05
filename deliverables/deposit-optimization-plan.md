# 订金页转化与品牌优化方案(两阶段)

> 日期:2026-08-05
> 范围:`deposit.html` / `js/deposit.js` 当前预订版(Hero + 预订卡结构)
> 目标:页面高效转化 + 品牌喜爱
> 状态:高优先级改动已实施并通过本地验证;两阶段框架与 deferred 清单见下

## 1. 背景与诊断

早前的移动端审计(重复价格块、$379、"Current window" 占位符、付款型 FAQ)已在预订版重构中全部解决。本方案是重构后的**下一轮**,针对复核发现的四个剩余问题:

| # | 问题 | 影响 |
|---|---|---|
| 1 | **状态失谐**:`shopifyProductUrl` 为空时 JS 把 4 个 CTA 全部改写为 "Get notified when reservations open",但静态文案仍是 "Due today $9 / $9 today locks $229 / Today — $9 holds your price" | 承诺与按钮动作不一致。对 55+ 众筹新手,这是"网站坏了/骗人"信号,是最大转化断点 |
| 2 | **字号低于人群底线**:压缩排版后正文 13–14px,≤560px 还有 12px 与 14px 的冲突重复规则 | 55+ 移动端正文标准 ≥16px |
| 3 | **紧迫感未接线**:`daysLeft()` / `[data-countdown-days]` 逻辑存在但 HTML 无挂点 | Sep 6 截止的真实倒计时被浪费 |
| 4 | **文档失同步**:需求文档描述旧页;发布闸门引用已删区块的埋点;`shopify-payment-handoff.md` 的退款条款与页面矛盾 | 执行与验收依据失真;退款矛盾是 State B 上线阻断项 |

## 2. 两阶段运营框架

页面用同一份 HTML 服务两个状态,切换只靠生产注入 `window.LUNAWAKE_DEPOSIT_CONFIG`,零发版:

### State A — 预览态(现在,`shopifyProductUrl` 为空)

- **页面目标**:订金页 → prelaunch 留资点击率;页面诚实地讲"预订即将开放,先占位",不假装能收钱。
- **北极星**:`deposit_cta_click`(`checkout_state=preview`, `destination=launch_list`)+ `deposit_waitlist_click`。
- **文案机制**:HTML 默认文案 = live 态(SEO / 无 JS 兜底正确);JS 按 `data-state-copy` 挂点把付款语言改写为等待语言(见 §3.2)。

### State B — 收款态(注入真实 Shopify URL 后)

- **页面目标**:$9 支付完成率(北极星与放量节奏见 `deposit-release-gate.md`)。
- **上线前置阻断项**:~~退款政策裁决~~(✅ 已按页面口径统一,见 §5);Shopify 收款 gate 见 handoff 文档(搁置中,回填后即可切换)。

## 3. 已实施改动(本轮)

### 3.1 字号无障碍修正(`deposit.html` 内联 CSS)

- 桌面正文(信任条、benefit、步骤、FAQ 答案、hero policy/proof、颜色投票说明)13–14px → 15px;卡片 status/链接 → 14px。
- 561–900px 真空档补齐:正文 16px。
- ≤560px:删除全部冲突重复声明(proof 12/13/14px、policy 12px 等),终值正文 ≥16px、proof ≥15px、卡片 dt/deadline 16px。
- 标题、eyebrow、价格数字不动。
- 验证(getComputedStyle 抽查):1280px 全 ≥14px;800px 正文 16px;390px 正文 16px、无残留 12/13px。

### 3.2 状态感知文案(`data-state-copy` + `STATE_COPY`)

机制:元素加 `data-state-copy="<key>"`;`js/deposit.js` 的 `STATE_COPY.preview` 提供预览态字符串;`updateStateCopy()` 首次运行把默认 innerHTML 缓存进 `dataset.defaultCopy`(幂等),非 preview 态回退默认。**必须在 `updatePriceCards()` 之前调用且只调用一次**,否则注入的 deadline/倒计时 span 会被回填后又清空。

| key | live(HTML 默认) | preview(JS 覆写) |
|---|---|---|
| card-due-label | Due today | Reservation deposit |
| card-deadline | This price ends **Sep 6 · 11:59pm ET** — N days left. | Reservations open soon — the founding price ends **Sep 6 · 11:59pm ET** — N days left. |
| price-headline | $9 today locks $229. | $9 will lock $229. |
| price-deadline | This price ends … | The founding price ends … The launch list hears first when reservations open. |
| steps-lede | Today — $9 holds your price. … | When reservations open — $9 holds your price. … |
| step1-time / step1-body | Today / That is it. … | At open / We email you the moment reservations open. … |
| final-heading / final-lede | Hold your LunaWake for $9 today. | Be first when reservations open. + 2,000+ 社证 |
| sticky-label | $9 · Reserve your LunaWake | Reservations open soon(≤360px:Open soon) |

配套逻辑:preview 态隐藏卡片内 `data-preview-link`(主按钮已跳留资页,同卡双 ask 冗余)与终区 "Not ready to reserve?" 链接;closed/ended 保留 preview-link 作逃生口。状态行与提交中文案同步状态化("Opening secure checkout…" / "Taking you to the launch list…"),移除面向用户的 "Shopify" 字样。

### 3.3 倒计时接线(诚实紧迫感,两态通用)

- 预订卡与价格区 deadline 句尾新增 `<b data-countdown-days hidden>`;JS 填 " — N days left" / " — ends today",`endAt` 缺失时整体隐藏、句子仍完整(分隔符在元素内部)。
- 天数由 `priceWindows.founding.endAt` + ET 时区按日历日计算,不写死。

### 3.4 品牌喜爱微文案

- 颜色投票反馈(实现定稿):`{Finish} — good eye. Thanks.`;未投:`No vote yet — pick the one you'd want on your nightstand.`(2026-08-05 起投票对象为三色渲染选色器,见 requirements v3.1 §3.7)
- live 状态行:`Secure checkout — $9 today, refundable any time.`
- preview 状态行:`Reservations open soon. Leave your email and we will tell you the moment they do.`

### 3.5 验证记录(本地 headless 浏览器)

- Preview 态:全页无付款措辞;4 CTA = "Get notified…";倒计时 "32 days left";preview-link 与 secondary link 隐藏;console 无错误。
- Live 态(注入 `shopifyProductUrl` 模拟):全部文案回退 live 默认;CTA = "Reserve $9";状态行正确;倒计时保留。
- Closed 态(`campaignState:'kickstarter_live'`):CTA 禁用 + "Reservations are closed";文案回退默认;preview-link 显示为逃生口。
- 断点:1280 / 800 / 390 字号全部达标;整页截图无破版。

## 4. 本次新增：Nothing 式字体与版式审计

### 4.1 审计结论

当前页面的问题不是“某一个字号偏大”，而是多轮临时媒体查询形成了层叠漂移：同一类标题在桌面、平板、手机被重复覆写，Hero、Reservation Summary、Coach 和价格区没有共享明确的视觉比例。结果是首屏有品牌气质，但滚动后信息密度不稳定；蓝色眉题和证明文字在部分视口又过小，55+ 用户需要停下来辨认。

本轮按 Nothing 的克制原则收束：只保留 3 个响应断点、3 个文字层级、正文不低于 16px；标题用紧行高制造秩序，正文用足够行高保证阅读，字距只服务于小标签，不给正文加装饰性 tracking。

### 4.2 字体规格（最终目标）

| 角色 | 桌面 | ≤900px | ≤560px | 行高 / 字距 |
|---|---:|---:|---:|---|
| Hero 主标题 | 56–88px | 46–64px | 42–54px | `.92 / .94 / .96`；负字距随断点减弱 |
| Section 标题 | 42–64px | 40–56px | 38–48px | `.94 / .96 / .98`；约 `-.04em` |
| Reservation 卡标题 | 32–40px | 32px | 30px | 约 `.98`；`-.04em` |
| 正文与解释 | 16–17px | 16px | 16px | `1.55`；不加 tracking |
| Eyebrow / 时间标签 | 10px | 10px | 10px | `1.3`；`0.14em`，只用于 uppercase |
| Sticky CTA | 15px | 15px | 15px | `1.2`，保证按钮高度和可扫描性 |

### 4.3 已一并实施

- 在 `deposit.html` 最后一层建立统一 typography pass，覆盖 Hero、section、卡片、价格、Coach、FAQ 和 sticky CTA，避免继续出现同类元素各自漂移。
- 手机正文、FAQ、政策、截止日期统一为 `16px / 1.55`；证明行从过小的 9px 提升到 11px，并减少过度字距。
- 预览态 Hero 恢复一句产品价值，再接等待开放动作；页面不再只说“加入名单”。
- 删除步骤正文中多余的 Kickstarter 流程术语，保留 FAQ 中的完整解释，降低第一次付款用户的认知负担。
- Closed / ended 状态不再显示泛化的“checkout 未开放”，而是给出明确的窗口状态和下一步。
- 价格阶梯保持展开，作为收银台后的证据层，不抢 Hero 主 CTA。
- Coach 长图恢复固定阅读窗口：桌面/平板约 420–520px、手机 400px，长图只在卡片内部滚动，不能把整个页面撑高；底部渐变和滚动提示保留。

### 4.4 走查与验收

在 390px、768px、1280px 视口检查：无横向滚动；所有移动正文 ≥16px；标题不裁切、不与卡片重叠；小标签可读且不使用低对比蓝色正文；sticky CTA 不遮住 Reservation Summary 内的主按钮；FAQ 默认折叠。之后再做一次 iOS/Android Facebook in-app browser 真机检查。

## 5. 指标与埋点(两态通用)

所有事件携带 `checkout_state`:`deposit_cta_view`、`deposit_cta_slot_view`(每槽位一次)、`deposit_cta_click`(destination: launch_list | shopify_checkout)、`deposit_cta_blocked`、`deposit_coach_view`、`deposit_finish_vote`、`deposit_waitlist_click`。State A 周报看:留资点击率(按 cta_slot 分)、颜色投票参与率(品牌互动代理指标)、FAQ 展开率。State B 切换后按 release gate 的 `$9 payment completed / eligible Lead`。

## 6. Deferred(按顺序,本轮不做)

1. **Shopify URL 就位 gate**(State B 前置):按 `shopify-payment-handoff.md` 回填,内部真实支付走一遍。
2. ~~**退款政策裁决**~~ ✅ 已裁决(2026-08-04):采用页面通用口径($9 发射前后均可退,任何理由),handoff C/D 条已同步;剩余动作 = 确认邮件与客服口径按此配置。
3. **内联 CSS 五层覆写合并**为单一样式表(State B 上线前做,现在改动已稳定即可动手)。
4. **Header CTA 是否恢复**:拿 State A 的 cta_slot 数据再定。
5. **FB in-app browser 真机 QA**:iOS/Android FB webview 各过一遍(粘性底栏 safe-area、100svh、localStorage、跳转 prelaunch/Shopify)。投放流量大半从 FB 应用内浏览器进入,这是独立渲染环境。
6. **Sep 7 价格窗口滚动**:founding 窗口过期后卡片会显示 "Founding price locked $319",需在 Sep 7 通过 config 更新窗口与文案(已写入 release gate 运营事项)。
7. **KOL/社证素材上页**:素材到位后在 trust 条下方或 FAQ 前加一条真实引用,替代目前唯一的 "2,000+" 数字。

## 7. 验证方法(回归用)

```
python3 -m http.server 8742
# Preview 态:直接开 http://localhost:8742/deposit.html
# Live 态模拟(console):
window.LUNAWAKE_DEPOSIT_CONFIG={shopifyProductUrl:'https://example.com/checkout'};
var s=document.createElement('script');s.src='js/deposit.js?sim=1';document.body.appendChild(s);
# Closed:campaignState:'kickstarter_live';Ended:campaignState:'campaign_failed'
```

逐项检查:两态文案表(§3.2)、CTA 标签与跳转 UTM、倒计时天数、三档断点(>900 sticky 隐藏;≤900 sticky 显示;≤560 正文 ≥16px)、console 无错误。
