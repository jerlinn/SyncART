# LunaWake 订金页发布闸门

> 目的：在把 2,000 个 Leads 导入订金页前，确认用户看到的是规则清楚、可支付、可追踪的正式版本。

## 当前状态

- 本地：已完成收银台优先的预订版，顺序为 Hero → Reservation Summary → 信任条 → 声音/晨读/光 → 价格 → 两步流程 → Luna Coach → 三色渲染选色器（2026-08-05 替代五色偏好） → FAQ → Final CTA。
- 线上：`https://lunawake.ai/deposit.html` 已与本地同步（GitHub Pages，push 即部署）。
- 支付：本地配置中的 `shopifyProductUrl` 仍为空，因此本地 CTA 会进入 launch list 预览状态；不会伪造支付成功。
- 双状态文案：preview 态由 `data-state-copy` 机制把付款语言改写为等待语言（"Reservation deposit / Reservations open soon"），注入真实 Shopify URL 后自动恢复付款文案；契约表见 `deposit-page-requirements.md` §5。

## State A（预览态）放量指标

在 Shopify 收款就绪前，订金页可作为留资入口投放。此阶段：

- 北极星 = `deposit_cta_click`（`checkout_state=preview`、`destination=launch_list`）/ 页面到访，按 `cta_slot` 分槽观察；
- 辅助：`deposit_waitlist_click`、`deposit_finish_vote` 参与率（品牌互动代理）、FAQ 展开行为；
- 页面不得出现 "Due today / $9 today" 类当下付款措辞（由 state-copy 保证，发布后抽查）。

在下列闸门完成前，不发送主批次 EDM、Group 或广告流量到订金页。

需要转发给 agency / Shopify 同事的字段清单见
[`shopify-payment-handoff.md`](shopify-payment-handoff.md)。

## 发布前必须完成

### 1. 生产文件发布

将本地版本发布到实际承载 `deposit.html` 的生产分支/主机，至少包括：

- `deposit.html`
- `js/deposit.js`
- `styles.css`
- 订金页依赖的图片与 WebP 资源（当前版本无视频）

生产环境可以在加载 `js/deposit.js` 前注入 `window.LUNAWAKE_DEPOSIT_CONFIG`，
覆盖 Shopify 商品链接、launch list URL、campaign state、价格解锁状态、价格窗口和日期；
不需要修改页面结构。未注入真实商品链接时，CTA 进入可点击的 launch list 预览状态。

发布后线上页面应能检查到：

- 产品承诺 Hero 与唯一 Reservation Summary，同时显示 `$9 / $229 / $319`、退款边界和 CTA；价格区默认展开并展示 `$229 / $269 / $319` 三档阶梯；
- 首屏之后的声音、晨间解读和光三条核心卖点；
- 退款保护在 Summary 先给结论，并在 FAQ 末条完整解释；
- 当前主价格与后续价格阶梯；
- 预订 → 个人订单链接两步流程，launch day 复用价格窗口配置；
- Luna Coach、三色渲染选色器（Amber/Stone/Charcoal，默认 Stone）、FAQ、Final CTA 与移动端固定 CTA；
- 无 Shopify URL 时所有预约 CTA 可点击并引导用户进入 launch list；
- 不再出现旧的临床效果承诺或未经确认的库存、发货承诺。

资源与埋点验收：

- Hero 图 preload + `fetchpriority="high"`，长截图与 finish 渲染图 lazy；
- finish 渲染图为 720/1440 WebP 双档 srcset（与首页共用资产），切换淡入不引发布局跳动；
- 预订卡与价格区的倒计时显示正确天数（ET 日历日），`endAt` 缺失时隐藏且句子完整；
- `deposit_cta_view` 保留；每个 `deposit_cta_slot_view` 的 `cta_slot` 只曝光一次；
- 全部事件携带 `checkout_state`；`deposit_coach_view` 只记录一次；
- （已废弃：proof 视频区块与 `deposit_proof_view` / `deposit_proof_video_play` 事件，区块已删除）；
- 页面不生成支付成功事件，支付完成仍以 Shopify 订单为准。

### 2. Shopify 收款配置

将真实 Shopify $9 商品 URL 或商品 Handle 写入 `js/deposit.js` 的 `shopifyProductUrl`。

> ✅ **退款政策已裁决（2026-08-04）：采用页面通用口径**——`$9` 发射前后均可申请原路全额退款，任何理由。`shopify-payment-handoff.md` C/D 条已同步更新;确认邮件与客服口径必须使用同一表述后方可开启收款投放。

上线前确认：

- 商品价格为 $9；
- 商品可结账、库存/发布状态正确；
- 成功支付后能发送确认邮件；
- 订单可记录 `utm_source`、`utm_medium`、`utm_campaign`、`utm_content`、`utm_term`、`angle`、`creative`；
- 支付成功邮件包含专属链接/后续说明和客服入口；
- 颜色仅作为偏好记录，不成为支付必填变体。

### 3. 小流量验收

先使用内部邮箱和 10–20 个真实测试用户完成：

1. EDM / Group 链接进入页面，不重复填写 Leads 表单；
2. 广告新用户直接理解 $9、$229 founding price、$269 next window、$319 launch-day price 和个人订单链接的关系；
3. Preview 点击 CTA 后进入 launch list；配置真实 URL 后点击 CTA 进入 Shopify 结账；
4. 支付成功后能收到确认邮件；
5. 退款、邮箱更正、链接补发和重复订金能够找到人工客服；
6. 桌面端、移动端、键盘操作和 FAQ 无阻塞。

### 4. 价格窗口滚动(Sep 7 / Sep 21 运营事件)

founding 窗口(Sep 6 · 11:59pm ET)过期后,`currentWindow()` 自动进入 $269 super-early 窗口(倒计时随 `endAt` 继续工作),但预订卡的 "Founding price locked" 标签会错位显示 $269。**Sep 7 当天**需通过 `LUNAWAKE_DEPOSIT_CONFIG` 核对/更新窗口文案与卡片标签;Sep 20 过期后同理回落到 $319,**Sep 21** 需配合切换 `campaignState`。不要依赖页面自动兜底。

## Leads 放量顺序

- Smoke：100–200 人，先看支付完成率和客服异常；
- Cohort：400–600 人，分高意向 Leads、已互动 Leads、未互动 Leads；
- Main：剩余人群；保留 10% 对照组用于比较原 Leads 流程与订金流程。

核心指标是 **$9 payment completed / eligible Lead**，不是点击率。同步观察：

- 订金页到 Shopify 的点击率；
- Shopify 结账完成率；
- 邮箱不一致率；
- 退款/客服率；
- 订单完成率与 Coach 激活率。

## 放量停止条件

出现以下任一情况，暂停扩大流量并先修复：

- CTA 仍显示不可支付或 Shopify URL 为空；
- 用户误解为 $9 直接抵扣 Kickstarter 金额；
- 用户不知道 `$9` 在任何时候都可申请退款；
- 线上页面仍展示旧规则或旧健康/临床表述；
- 支付成功邮件、专属链接或客服路径无法完成闭环。
