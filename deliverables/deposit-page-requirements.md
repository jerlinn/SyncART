# LunaWake 订金页产品需求文档

> 版本:v3.0(2026-08-04)
> 状态:与当前 `deposit.html` / `js/deposit.js` 实现对齐;待接入 Shopify 商品 URL 与 agency 的 Kickstarter 配置
> 变更:替代 v2.2。恢复 $269 三档窗口；保留双状态文案契约、倒计时规格与事件目录。
> 相关文档:`deposit-optimization-plan.md`(本轮优化方案)、`deposit-release-gate.md`(发布闸门)、`shopify-payment-handoff.md`(收款回填单)

## 1. 产品目标

订金页直接收取 `$9` 订金,锁定 `$229` 创始价,承接两类用户:

- 广告新用户:无需先注册 Leads,理解规则后直接进入 Shopify 支付;
- 已注册 Leads:通过 EDM / Group 进入,不重复填写留资表单。

核心目标是 `Leads → $9 支付完成率`;现有约 2,000 个 Leads 是首批转化人群。点击率只做辅助指标,最终以 Shopify 成功订单为准。

**双状态运行**:同一份页面服务两个状态,由配置注入切换、零发版:

- **State A(preview)**:`shopifyProductUrl` 为空。目标 = 订金页 → prelaunch 留资点击率;所有 CTA 可点击并跳转 launch list,页面文案改写为"预订即将开放"(见 §5),不假装能收款。
- **State B(live)**:注入真实 Shopify URL 后。目标 = $9 支付完成率;页面恢复默认付款文案。

## 2. 核心信任原则(自 v2.2 延续)

### 2.1 先讲清楚,再讲卖点

86.9% 的前测用户没有众筹经验,主叙事必须像普通预订:今天 `$9` 锁定 `$229` 创始价;9 月 21 日邮件收到个人订单链接,一键完成订单。Kickstarter 只在两步流程与 FAQ 中各出现一次;不使用 `pledge`、`backer`、`stretch goal` 等行话。面向用户的按钮与状态文案不出现 "Shopify" 字样(用 "secure checkout")。

### 2.2 退款规则首屏公开

- `$9` 在发射前后均可申请原路全额退款,任何理由;
- 用户改变主意或不完成订单,不影响退款资格;
- 发射取消,原路全额退款(只在 FAQ 末条完整解释一次);
- 退款保障是首屏信任信号(hero policy + 卡片 promise + 信任条),不反复渲染失败风险。

> ✅ 已裁决(2026-08-04):采用本节页面口径为全链路通用政策。`shopify-payment-handoff.md` C/D 条已同步更新为"发射前后均可退款";确认邮件与客服口径须一致。

### 2.3 `$9` 的语义

- `$9` 是订金,不是产品正式付款,也不自动抵扣正式订单金额;
- 正式订单通过发给用户的个人链接完成;订金邮箱和订单邮箱必须一致;
- "separate payment / not deducted" 类细则只在 FAQ 集中解释一次。

### 2.4 只使用已确认的 wellness 表述

不使用 PSG、临床级、诊断、治疗承诺。可用:No camera / No wearable / Raw signals stay on the device / Wellness product, not a medical device。隐私是信任行,不占主标题位。

## 3. 页面结构(与实现一致)

DOM/视觉顺序(由内联 CSS `order` 固定,移动端单列同序):

1. **Hero + 预订卡**:左侧 "Hold your LunaWake for $9." + lede + 退款 policy + 2,000+ 社证;右侧 `<aside>` 预订卡(唯一价格卡):eyebrow、"A better night, held for $9."、Due today $9、Founding price locked $229 / Launch-day price $319、✓ Refundable、deadline + 倒计时、主 CTA、状态行、preview 链接(仅 closed/ended 显示)。
2. **信任条**(3 项):Refund any time / One email on Sep 21 completes your $229 order / Real humans: info@lunawake.ai。
3. **What you get**:"The room does the work." 三条(Every night / While you sleep / Every morning)+ 场景图 + 隐私信任行。
4. **价格区**:"$9 today locks $229." + Sep 21 变 $319 + deadline + 倒计时 + CTA;完整三档价格表默认展开在 `<details>` 内。
5. **两步流程**:Today($9 holds your price)/ Sep 21(personal order link,括号内一次性说明 Kickstarter)。
6. **Luna Coach**:完整权益模块(30 天 included、$19.99 value、Sleep Pattern 长截图、Day 1 → Daily → Weekly → Day 30 节奏、Apple Health 衔接、wellness 边界),无独立购买 CTA。
7. **五色投票**:Dawn / Moonstone / Midnight / Amber / Sage,纯偏好投票,localStorage 本地保存,不透传 SKU、不阻塞支付。
8. **FAQ**(5 条,产品前置):What does LunaWake do? / Do I need a subscription? / When does LunaWake ship? / Why are there two payments? / Can I get my $9 back?(退款细则唯一完整出处)+ 人工客服邮箱。
9. **终 CTA** + **移动端粘性底栏**(≤900px 显示,safe-area 适配)。

### 3.1 价格窗口(三档)

| 窗口 | 价格 | 截止/生效 | 说明 |
|---|---:|---|---|
| founding | `$229` | Sep 6 · 11:59pm ET(`endAt` 配置) | Save $90 vs. launch day |
| super-early | `$269` | Sep 7 · 12:00am ET – Sep 20 · 11:59pm ET | Save $50 vs. launch day |
| early(launch-day) | `$319` | Sep 21 起 | +$90 after current |

- 日期、时区(America/New_York)、状态全部由 `priceWindows` 配置;页面无第二套日期来源;
- 倒计时由 `endAt` 按 ET 日历日计算,显示 `N days left` / `ends today`;`endAt` 缺失时倒计时隐藏,不显示虚假紧迫感;
- 不展示类目锚点、未确认库存或 MSRP;Reward 售罄由 agency 执行升级方案;
- **Sep 7 运营事件**:founding 过期后自动进入 `$269` 窗口；上线前仍需核对配置、倒计时和卡片标签(见 release gate)。

## 4. CTA 与状态机

4 个 CTA 槽位(`data-cta-slot`):`reservation-card`、`pricing`、`final`、`mobile`。无 Header CTA(JS 数据就位后再评估)。

`checkoutState()` 四态:

| 态 | 条件 | CTA 行为 |
|---|---|---|
| `live` | 有 `shopifyProductUrl` 且 `reservation_open` | "Reserve $9" → 跳 Shopify(带全部归因参数) |
| `preview` | 无 URL | **可点击**,"Get notified when reservations open" → 跳 `launchListUrl`(utm_source=deposit-page, utm_content=槽位) |
| `closed` | `kickstarter_live` | 禁用,"Reservations are closed",preview 链接显示为逃生口 |
| `ended` | `campaign_failed/success` | 禁用,"Reservation window has ended" |

preview 态**不禁用** CTA(与 v2.2 相反)——每次点击都是可归因的留资转化;页面永不伪造支付成功。

## 5. 双状态文案契约(`data-state-copy`)

HTML 默认文案 = live 态;JS 的 `STATE_COPY.preview` 按 key 覆写,非 preview 回退默认(`dataset.defaultCopy` 缓存,幂等)。`updateStateCopy()` 必须先于 `updatePriceCards()` 执行且只执行一次。

| key | 挂点 | preview 覆写要点 |
|---|---|---|
| card-due-label | 卡片 Due today 标签 | Reservation deposit |
| card-deadline | 卡片 deadline 行 | Reservations open soon — the founding price ends …(含倒计时) |
| price-headline | 价格区 h2 | $9 will lock $229. |
| price-deadline | 价格区 deadline | …The launch list hears first when reservations open. |
| steps-lede | 两步 lede | When reservations open — … |
| step1-time / step1-body | 步骤一 | At open / We email you the moment reservations open. … |
| final-heading / final-lede | 终 CTA | Be first when reservations open. + 2,000+ 社证 |
| sticky-label | 粘性底栏 | Reservations open soon(≤360px: Open soon),去 $9 前缀 |

原则:preview 态全页不得出现 "Due today / $9 today" 类当下付款措辞;价格锁定承诺($229/$319/截止日)两态一致,因为它是真的。

## 6. 视觉与可达性

- 继承官网系统(暖黑、米白、金色、大号标题、编辑式分栏);CTA 3px 圆角(与实现一致,v2.2 的胶囊按钮作废);
- 主 CTA ≥52px 高;移动端卡片按钮 ≥56px;
- **正文字号下限:桌面 ≥15px,≤900px ≥16px,≤560px ≥16px(hero proof ≥15px,卡片辅助行 ≥14px)**;
- 粘性底栏 `env(safe-area-inset-bottom)` 适配,>900px 隐藏;
- Hero 图 webp + preload + `fetchpriority="high"`;长截图与颜色图 lazy;五色图 WebP 优先 + PNG fallback;
- 颜色投票触点 ≥44px、可键盘操作、`aria-pressed`。

## 7. 数据、归因与实验

### 7.1 UTM 与订单属性

页面读取并透传:`source`、`utm_*`、`angle`、`creative`、`placement`;跳转(Shopify 或 launch list)追加 `price_window`、`reward_price`。Shopify 侧必须通过 Cart Attributes / Flow 保存;仅拼接 URL 不算归因闭环。颜色投票不写入 `finish`(纯本地偏好)。

### 7.2 事件目录(全部携带 `checkout_state`)

| 事件 | 触发 | 关键字段 |
|---|---|---|
| `deposit_cta_view` | 页面加载 | — |
| `deposit_cta_slot_view` | 每个 CTA 槽位首次曝光(仅一次) | `cta_slot` |
| `deposit_cta_click` | CTA 点击 | `destination: launch_list \| shopify_checkout`、`cta_slot` |
| `deposit_cta_blocked` | closed/ended 态点击 | `reason` |
| `deposit_coach_view` | Coach 模块首次曝光 | `coach_days`、`coach_value` |
| `deposit_finish_vote` | 颜色投票 | `finish` |
| `deposit_waitlist_click` | preview/逃生链接点击 | `cta_slot` |

State A 北极星:`deposit_cta_click{checkout_state:'preview', destination:'launch_list'}` / 页面到访。State B 北极星:$9 支付完成率(Shopify 订单为准,页面不伪造)。

已废弃(区块已删):`deposit_proof_view`、`deposit_proof_video_play`、`deposit_finish_select`。

### 7.3 实验纪律

文案与价格窗口版本化并记录发布时间;测试期冻结版本;`utm_content` 对应单一素材主轴;高意向低预算用户经页脚出口回 Leads 流程,独立 UTM,不与主 CTA 同权重。

## 8. 配置接口

```js
window.LUNAWAKE_DEPOSIT_CONFIG = {
  depositAmount: '$9',
  campaignState: 'reservation_open',   // kickstarter_live → closed;campaign_failed/success → ended
  pricingUnlocked: true,
  launchListCount: '2,000+',
  shopifyProductUrl: '',               // 注入真实 URL 即切 State B
  launchListUrl: 'https://prelaunch.lunawake.ai/',
  supportUrl: 'mailto:info@lunawake.ai',
  priceWindows: [ /* founding $229 / super-early $269 / early $319, all ET */ ],
  finishes: { /* 五色 */ },
  coach: { includedDays: 30, value: '$19.99', availability: '…' }
};
```

配置注入是**唯一**状态开关;页面结构不随状态变化。

## 9. 上线验收(核对当前实现)

- [ ] 首屏:Hero $9 主张 + 预订卡内 `$9 / $229 / $319`、退款边界、deadline+倒计时、CTA;
- [ ] Preview 态:全页无付款措辞,4 CTA 可点击跳 launch list 并带 UTM,状态行为等待话术,卡片 preview 链接隐藏;
- [ ] Live 态:文案回退默认,CTA "Reserve $9" 跳 Shopify 带归因参数,状态行 "Secure checkout — $9 today, refundable any time.";
- [ ] Closed/Ended:CTA 禁用、文案回退、逃生链接可用;
- [ ] 倒计时天数正确(ET 日历日),`endAt` 缺失时隐藏且句子完整;
- [ ] 退款结论出现在 hero/卡片/信任条,细则仅 FAQ 末条完整解释一次;
- [ ] 两步流程日期来自 `priceWindows`,无第二日期来源;
- [ ] Coach 模块无购买 CTA、无订阅文案,`deposit_coach_view` 只记录一次;
- [ ] 颜色投票不透传 SKU、不阻塞支付,投票后有确认反馈;
- [ ] 字号:≤560px 正文 ≥16px 抽查通过;三档断点无横向溢出;
- [ ] 事件目录 §7.2 全部可观测且不重复记录;console 无错误;
- [ ] 记录版本号、发布时间与实验变量。

## 10. 职责与阻塞项

**LunaWake / Shopify**:$9 商品 URL、订单属性/Flow、退款与客服、支付成功邮件与 Group 入口。
**Agency / Kickstarter**:两档 Reward 价格与截止确认、个人链接与补发机制、pledge 核验名单、售罄方案、coaching 激活名单。

当前阻塞项:

1. Shopify 商品 URL 未配置(State B 前置);
2. ~~退款政策矛盾~~ ✅ 已裁决:采用页面口径,剩余动作是确认邮件与客服口径按此配置;
3. Shopify 订单属性 / Flow 未验证;
4. Kickstarter 个人链接与 Reward 配置未接入;
5. 颜色方案未定案,页面仅收集偏好投票。
