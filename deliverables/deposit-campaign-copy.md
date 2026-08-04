# LunaWake 订金活动文案与链接规范

> 用途：Shopify $9 商品可支付、支付成功邮件和退款流程验收通过后，直接用于 2,000 Leads 的分批测试。

## 发送前置条件

在 Shopify 商品链接为空、CTA 仍禁用或支付成功邮件未配置前，不发送以下文案。

放量目标是约 1,000 笔真实 $9 支付；50% 是内部挑战目标，不是对用户的承诺。第一批只验证支付和规则理解，不用第一批结果直接推断全量转化。

## 统一规则话术

所有 EDM、Group 帖和客服回复使用同一组规则：

- Pay $9 through Shopify to reserve your founding price.
- You can request a full refund any time, for any reason.
- On Sep 21, we email your personal order link. Use the same email to complete your order.
- If you change your mind, the $9 stays refundable.
- If the launch is canceled, the $9 is refunded in full.
- The $9 is a Shopify reservation, not the product payment or an automatic deduction.

不要使用：`$9 is applied to the order`、`coaching starts after shipping`、`pledge`、`backer`、`campaign failure` 等需要众筹经验才能理解的术语。

## High-intent Leads：优先批次

### EDM

**Subject:** Lock your LunaWake launch price for $9

**Preheader:** $229 today, $319 on launch day. Refundable any time.

**Body:**

Before you reserve, here is exactly how it works:

1. Pay a $9 reservation through Shopify to lock the $229 founding price.
2. You can request a full refund any time, for any reason.
3. On Sep 21, we email your personal order link. Use the same email and one click completes your order.

If you change your mind or the launch is canceled, you can request the $9 back in full through the original Shopify payment method. The $9 is a Shopify reservation—not the product payment or an automatic deduction.

Your reservation also qualifies you for 30 days of Luna Coach after your order is verified. Coaching starts before shipping.

**CTA:** Reserve for $9 →

**Link:**

```text
https://lunawake.ai/deposit.html?audience=lead&utm_source=edm&utm_medium=email&utm_campaign=deposit_launch_v1&utm_content=rules_first&utm_term=high_intent&angle=offer&creative=edm_high_intent_01
```

## Engaged Leads：第二批

### EDM / Group

**Headline:** Your next LunaWake step is ready

**Body:**

You are already on the LunaWake launch list—there is no second form to fill out.

Reserve for $9 through Shopify. You can request a full refund any time, for any reason. On Sep 21, we will send your personal order link; use the same email to complete your order at the price you locked.

The $9 remains a separate reservation after launch. It is not automatically deducted from your product payment, and you can request a full refund any time, for any reason.

**CTA:** Lock my launch eligibility →

**Link:**

```text
https://lunawake.ai/deposit.html?audience=lead&utm_source=group&utm_medium=community&utm_campaign=deposit_launch_v1&utm_content=rules_first&utm_term=engaged&angle=offer&creative=group_engaged_01
```

## Unengaged Leads：先解释，再转化

不直接使用稀缺或倒计时压力。先发送规则解释邮件，24–48 小时后再发送订金 CTA。

**Subject:** What the LunaWake $9 reservation actually does

**Preheader:** One reservation, one personal order link, and clear refund rules.

**Body:**

The $9 is a Shopify reservation that records your founding-price eligibility. It is not the product payment itself.

You can request a full refund any time, for any reason. On Sep 21, use the personal order link we send and the same email to complete your order. If the launch is canceled, the $9 is refunded in full.

If you are ready, reserve here. If you are not ready to pay, you can remain on the launch list and wait for the order-link update.

**Primary CTA:** Reserve for $9 →

**Secondary CTA:** Stay on the launch list →

## 发送与链接规则

- 每个用户只发送一个主订金链接，避免重复订单；
- EDM / Group 链接必须包含 `utm_term` 分组和 `creative` 素材编号；
- 页面识别到 `edm`、`email`、`group`、`lead`、`crm` 或 `community` 时，显示“已在 launch list，无需重新留资”；
- Shopify 订单邮箱必须作为正式订单匹配邮箱提醒；
- 支付完成后，不再重复发送订金 CTA，转入订金用户邮件/小组流程；
- 用户已退款、已重复支付或已进入异常队列时，停止自动催付并转人工客服。

## 建议发送顺序

| 批次 | 人群 | 规模 | 素材 | 观察重点 |
|---|---|---:|---|---|
| Smoke | High-intent | 100–200 | `edm_high_intent_01` | 能否成功支付、规则客诉、邮件送达 |
| Cohort A | Engaged | 200–300 | `group_engaged_01` | Lead 直达、点击到支付完成 |
| Cohort B | High-intent / Engaged | 200–300 | `price_anchor` 对照版 | 价格锚点对支付完成率的影响 |
| Main | 剩余 Leads | 其余 | 胜出版本 | 放大支付完成率，保留 10% holdout |

## 每日看板最少字段

- eligible Leads；
- deposit page views；
- Shopify checkout started；
- $9 payment completed；
- Leads → payment completed rate；
- refund requested；
- email mismatch / support tickets；
- completed order（上线后）。
