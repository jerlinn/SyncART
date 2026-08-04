# LunaWake Shopify $9 支付上线确认单

> 目标：让订金页从安全预览状态切换为可真实收款状态，并支持 2,000 个 Leads 的分批转化测试。

## 请 agency / Shopify 同事回填

### A. 商品与结账

- [ ] Shopify $9 商品已创建并发布
- [ ] 商品名称：LunaWake launch-price reservation
- [ ] 商品价格：$9 USD
- [ ] 商品 URL：`________________________________________`
- [ ] 商品 Handle（如有）：`________________________________`
- [ ] 测试结账 URL：`______________________________________`
- [ ] 测试订单号：`________________________________________`
- [ ] 是否需要收取运费：`是 / 否 / 待确认`

### B. 订单归因

确认以下字段可以随链接进入 Shopify 订单或可查询的订单备注：

- email；
- `utm_source`；
- `utm_medium`；
- `utm_campaign`；
- `utm_content`；
- `utm_term`；
- `angle`；
- `creative`；
- `finish`（颜色偏好，不作为必填变体）；
- 命中的价格窗口；
- 退款状态与退款时间。

如果 Shopify 原生订单不会保留 URL 参数，请由 Shopify 主题、Cart Attributes、Shopify Flow 或现有营销工具补齐，不要只依赖订金页的浏览事件。

### C. 支付后承接

- [ ] Shopify 支付确认邮件已配置
- [ ] 邮件说明同一邮箱用于 Kickstarter pledge
- [ ] 邮件包含订金用户 Group 邀请链接：`____________________`
- [ ] 邮件包含客服入口：`_______________________________`
- [ ] 邮件没有写成 `$9 自动抵扣 Kickstarter`
- [ ] 邮件没有写成“众筹结束后自动退 $9”
- [ ] 邮件明确：上线前可退款；上线后未 pledge 不退款

### D. 退款与异常

- [ ] 上线前退款：客服核验 Shopify 订单后原路退款
- [ ] Kickstarter 上线后未 pledge：$9 不退款
- [ ] 众筹失败或取消：全额原路退款
- [ ] 邮箱不一致 / Apple 隐藏邮箱：有人工更正流程
- [ ] 重复订金：有合并或退款处理流程
- [ ] 专属链接补发：有人工处理入口
- [ ] Reward 售罄：有 agency 确认的升级/替代方案

## 发布动作

收到 A–D 回填后：

1. 将商品 URL 写入 `js/deposit.js` 的 `shopifyProductUrl`，或通过 `window.LUNAWAKE_DEPOSIT_CONFIG` 注入；
2. 保持 `pricingUnlocked: false`，直到价格测试正式批准；
3. 用内部邮箱完成一次真实 $9 支付；
4. 验证 UTM、finish、确认邮件、Group 邀请和退款；
5. 先发送 100–200 人 smoke test；
6. 无支付阻塞和集中客诉后，再进入 cohort 和全量 Leads 放量。

## Go / No-go

### Go

- 商品 URL 可结账；
- $9 实际收款成功；
- 订单邮箱可用于后续 Kickstarter 匹配；
- 支付成功邮件和客服路径可用；
- 退款规则与页面完全一致。

### No-go

- 商品 URL 为空或 CTA 仍禁用；
- 订单无法保留来源或邮箱；
- 用户无法收到支付后邮件或 Group 邀请；
- 退款边界与页面文案不一致；
- 仍未确认真实支付是否成功。

