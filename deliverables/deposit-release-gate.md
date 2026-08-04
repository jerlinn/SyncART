# LunaWake 订金页发布闸门

> 目的：在把 2,000 个 Leads 导入订金页前，确认用户看到的是规则清楚、可支付、可追踪的正式版本。

## 当前状态

- 本地：已完成面向新手的预订版，顺序为 Hero → 声音/晨读/光 → 价格窗口 → 分期说明 → 社会证明 → 退款规则 → 五色偏好 → 三步流程 → Luna Coach → FAQ → Final CTA。
- 线上：`https://lunawake.ai/deposit.html` 仍为旧版页面，不能作为本轮转化测试入口。
- 支付：本地配置中的 `shopifyProductUrl` 仍为空，因此本地 CTA 会保持禁用，避免伪造支付成功。

在下列闸门完成前，不发送主批次 EDM、Group 或广告流量到订金页。

需要转发给 agency / Shopify 同事的字段清单见
[`shopify-payment-handoff.md`](shopify-payment-handoff.md)。

## 发布前必须完成

### 1. 生产文件发布

将本地版本发布到实际承载 `deposit.html` 的生产分支/主机，至少包括：

- `deposit.html`
- `js/deposit.js`
- `styles.css`
- 订金页依赖的图片、poster、WebP 和 MP4 资源

生产环境可以在加载 `js/deposit.js` 前注入 `window.LUNAWAKE_DEPOSIT_CONFIG`，
覆盖 Shopify 商品链接、campaign state、价格解锁状态、价格窗口和日期；不需要
修改页面结构。未注入真实商品链接时，CTA 必须继续保持禁用。

发布后线上页面应能检查到：

- 结果导向 Hero，同时显示 `$9 / 当前 Reward / $319 launch-day price`、退款边界和 CTA；
- 首屏之后的声音、晨间解读和光三条核心卖点；
- 退款保护只由规则区完整解释；
- 当前主价格与后续价格阶梯；
- 预订 → 个人订单链接 → 发货三步流程，launch day 复用价格窗口配置；
- Luna Coach、五色展示、FAQ、Final CTA 与移动端固定 CTA；
- 无 Shopify URL 时所有按钮禁用，并明确显示 checkout 尚未开放、引导用户进入 launch list；
- 不再出现旧的临床效果承诺或未经确认的库存、发货承诺。

资源与埋点验收：

- 首屏不请求 `02-contact-free-sensing.mp4`，视频接近视口后才加载；
- reduced motion 下视频不自动播放，poster、caption 和原生控制正常；
- 五色图优先返回 WebP，PNG fallback 可用且不引发布局跳动；
- `deposit_cta_view` 保留；每个 `deposit_cta_slot_view` 的 `cta_slot` 只曝光一次；
- `deposit_proof_view` 与 `deposit_proof_video_play` 分别只记录首次有效行为；
- 页面不生成支付成功事件，支付完成仍以 Shopify 订单为准。

### 2. Shopify 收款配置

将真实 Shopify $9 商品 URL 或商品 Handle 写入 `js/deposit.js` 的 `shopifyProductUrl`。

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
2. 广告新用户直接理解 $9、$229 founding price、$319 launch-day price 和个人订单链接的关系；
3. 点击 CTA 后进入 Shopify 结账；
4. 支付成功后能收到确认邮件；
5. 退款、邮箱更正、链接补发和重复订金能够找到人工客服；
6. 桌面端、移动端、键盘操作和 FAQ 无阻塞。

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
