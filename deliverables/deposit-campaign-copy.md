# LunaWake 订金活动文案与链接规范

> 用途：Shopify $9 商品可支付、支付成功邮件和退款流程验收通过后，直接用于 2,000 Leads 的分批测试。

## 发送前置条件

在 Shopify 商品链接为空、CTA 仍禁用或支付成功邮件未配置前，不发送以下文案。

放量目标是约 1,000 笔真实 $9 支付；50% 是内部挑战目标，不是对用户的承诺。第一批只验证支付和规则理解，不用第一批结果直接推断全量转化。

## 统一规则话术

所有 EDM、Group 帖和客服回复使用同一组规则：

- Pay $9 through Shopify to reserve your launch-price eligibility.
- You can request a full refund before Kickstarter launches.
- When Kickstarter goes live, use the private link and the same email to pledge.
- After launch, the $9 is non-refundable if you do not pledge.
- If the campaign fails or is canceled, the $9 is refunded in full.
- The $9 is a Shopify reservation, not a Kickstarter pledge or an automatic deduction from your Kickstarter payment.

不要使用：`$9 is applied to Kickstarter`、`your deposit is always refunded after the campaign`、`coaching starts after shipping`。

## High-intent Leads：优先批次

### EDM

**Subject:** Lock your LunaWake launch price for $9

**Preheader:** Full refund before Kickstarter launches. Same email, private link, clearer next step.

**Body:**

Before you reserve, here is exactly how it works:

1. Pay a $9 reservation through Shopify to lock your launch-price eligibility.
2. Before Kickstarter launches, you can request a full refund.
3. When Kickstarter goes live, use our private link and the same email to pledge at the Reward price available to your reservation window.

After Kickstarter launches, the $9 is non-refundable if you do not pledge. If the campaign fails or is canceled, we refund the $9 in full. The $9 is a Shopify reservation—not a Kickstarter pledge or an automatic deduction from Kickstarter.

Your reservation also qualifies you for 30-day coaching after a valid pledge and a successful campaign. Coaching starts the next business day after pledge verification; it does not wait for shipping.

**CTA:** Reserve for $9 →

**Link:**

```text
https://lunawake.ai/deposit.html?utm_source=edm&utm_medium=email&utm_campaign=deposit_launch_v1&utm_content=rules_first&utm_term=high_intent&angle=offer&creative=edm_high_intent_01
```

## Engaged Leads：第二批

### EDM / Group

**Headline:** Your next LunaWake step is ready

**Body:**

You are already on the LunaWake launch list—there is no second form to fill out.

Reserve for $9 through Shopify. You can request a full refund before Kickstarter launches. At launch, we will send a private link; use the same email to pledge and access the Reward price tied to your reservation window.

Important: after launch, the $9 is non-refundable if you do not pledge. The reservation is separate from Kickstarter and is not automatically deducted from your Kickstarter payment.

**CTA:** Lock my launch eligibility →

**Link:**

```text
https://lunawake.ai/deposit.html?utm_source=group&utm_medium=community&utm_campaign=deposit_launch_v1&utm_content=rules_first&utm_term=engaged&angle=offer&creative=group_engaged_01
```

## Unengaged Leads：先解释，再转化

不直接使用稀缺或倒计时压力。先发送规则解释邮件，24–48 小时后再发送订金 CTA。

**Subject:** What the LunaWake $9 reservation actually does

**Preheader:** One payment, one private Kickstarter link, and clear refund rules.

**Body:**

The $9 is a Shopify reservation that records your launch-price eligibility. It is not the Kickstarter pledge itself.

Before Kickstarter launches, you can request a full refund. When the campaign goes live, use the private link we send and pledge with the same email. If you do not pledge after launch, the $9 is non-refundable. If the campaign fails or is canceled, it is refunded in full.

If you are ready, reserve here. If you are not ready to pay, you can remain on the launch list and wait for the campaign update.

**Primary CTA:** Reserve for $9 →

**Secondary CTA:** Stay on the launch list →

## 发送与链接规则

- 每个用户只发送一个主订金链接，避免重复订单；
- EDM / Group 链接必须包含 `utm_term` 分组和 `creative` 素材编号；
- 页面识别到 `edm`、`email`、`group`、`lead`、`crm` 或 `community` 时，显示“已在 launch list，无需重新留资”；
- Shopify 订单邮箱必须作为 Kickstarter 匹配邮箱提醒；
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
- valid Kickstarter pledge（上线后）。

