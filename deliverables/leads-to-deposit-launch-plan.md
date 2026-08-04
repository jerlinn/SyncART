# LunaWake 2,000 Leads → $9 订金转化执行方案

> 目标：将现有约 2,000 个前测 Leads 转化为约 1,000 笔 $9 订金。
> 50% 是内部挑战目标，不是页面承诺；最终以 Shopify 支付完成率为准。

## 1. 核心策略

订金页只做一件事：让已经完成前测的用户相信“下一步就是支付 $9 锁定资格”。

页面顺序固定为：

1. 退款、不可退款、邮箱匹配和 $9 的真实含义；
2. 三档价格窗口和价格锚点；
3. 三个关键时刻：现在预订、Kickstarter 上线后 pledge、众筹成功后 coaching；
4. 精简产品证明；
5. FAQ 和人工客服。

Leads 通过 EDM / Group 进入时，不再要求重复注册或填写表单。页面首屏显示“已在 launch list，无需重新留资”。

## 2. 分批投放

不建议一次性向 2,000 人发送同一链接。先用小批量验证支付链路和客诉，再逐步放量：

| 批次 | 建议人数 | 目的 | 放量条件 |
|---|---:|---|---|
| Smoke test | 100–200 | 验证 Shopify 支付、邮件、退款和邮箱匹配 | 无支付阻塞；规则相关客诉可处理 |
| Cohort test | 400–600 | 比较 Leads 类型与素材角度 | 支付完成率和有效 pledge 率达到预设阈值 |
| Main rollout | 其余 Leads | 放大已验证的版本 | 不出现退款/匹配异常集中上升 |

建议保留 10% holdout，不发送订金 CTA，用于比较自然转化和投放增量。

## 3. Leads 分组

- `high_intent`：Survey 中明确表示愿意购买、接受较高价格或关注 Kickstarter；优先进入第一批。
- `engaged`：已打开 EDM、进入 Group 或主动回复，但价格意愿不明确；进入第二批。
- `unengaged`：没有打开或长期未互动；先发送一封规则解释和产品回顾，再发送订金 CTA。

每个用户只保留一个主邮箱和一个 Shopify 订金状态，避免重复发送和重复下单。

## 4. UTM 规范

示例：

```text
https://lunawake.ai/deposit.html
  ?utm_source=edm
  &utm_medium=email
  &utm_campaign=deposit_launch_v1
  &utm_content=rules_first
  &utm_term=high_intent
  &angle=offer
  &creative=edm_01
```

字段含义：

- `utm_source`：`edm` / `group` / `crm`；
- `utm_medium`：`email` / `community`；
- `utm_campaign`：本次订金活动版本；
- `utm_content`：`rules_first` / `price_anchor` / `coaching`；
- `utm_term`：Lead 分组；
- `angle`：主卖点角度；
- `creative`：具体邮件、Group 帖或素材编号。

## 5. 必须记录的漏斗

| 事件 | 责任系统 | 说明 |
|---|---|---|
| `deposit_cta_view` | 订金页 | 页面被看到，记录来源、分组和卖点角度 |
| `deposit_cta_click` | 订金页 | 点击 Shopify 入口，记录 CTA 位置 |
| Checkout started | Shopify | 进入 Checkout |
| Payment completed | Shopify | $9 真实支付完成，作为主转化指标 |
| Refund requested | Shopify/客服 | 上线前退款或众筹失败退款 |
| Valid pledge | agency/Kickstarter | 后续核验，不与订金支付混为一谈 |

主指标：

```text
Leads → Shopify $9 Payment completed rate
```

辅助指标：Checkout completion rate、退款率、邮箱匹配成功率、有效 pledge 率、coaching 激活率。

## 6. 文案和规则护栏

- 不写“$9 直接抵扣 Kickstarter”；
- 不写“众筹结束后自动退 $9”；
- 不写“发货后开始 coaching”；
- 支付前必须说明：上线前可退款，上线后未 pledge 不退款；
- 必须提醒使用能接收通知的邮箱，Shopify 和 Kickstarter 使用相同邮箱；
- 价格未解锁时展示 `$300–$400` 参考区间和 `$379` 零售价上下文，不展示未经确认的 Reward 金额；
- PSG 只使用经过证据和法务确认的措辞。

## 7. 上线前最小阻塞项

1. Shopify $9 商品 URL / Handle；
2. Shopify 支付成功邮件和 Group 邀请链接；
3. 订单字段：邮箱、UTM、Lead 分组、finish、价格窗口、退款状态；
4. agency 的专属 Kickstarter 链接、Reward 价格和 pledge 核验流程；
5. 人工客服处理退款、邮箱更正、重复订金和链接补发；
6. 支付完成率、退款率和有效 pledge 率的日报或看板。

在第 1 项未配置前，页面只能作为本地预览，不能向 2,000 个 Leads 正式发送支付 CTA。
