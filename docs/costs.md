# 成本说明

价格核实日期：**2026-09-21**。下列金额均为美元，服务条款和价格可能调整，启用服务前应复核所链接的官方页面。

首版没有图片、后端或付费 API 调用，使用公开 GitHub 仓库和默认 Pages 域名发布，可在免费额度内运行。下列预算区分首版托管与后续可选服务；首版不涉及付费项目。

## 静态托管

| 方案 | 费用与主要限制 | 适用情况 |
| --- | --- | --- |
| GitHub Pages，公开仓库 | 可免费使用；已发布站点最大 1 GB；每月 100 GB 带宽软限制 | 首版默认方案 |
| Cloudflare Pages，纯静态站点 | 静态资源请求免费且不限量；免费计划每月 500 次构建、每站点最多 20,000 个文件、单文件最大 25 MiB | 后续按需要迁移 |
| 自定义域名 | 可选，注册和续费由注册商另行报价 | 不影响使用默认免费域名 |

依据：[GitHub Pages 限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)、[Cloudflare Pages 请求计费](https://developers.cloudflare.com/pages/functions/pricing/)、[Cloudflare Pages 平台限制](https://developers.cloudflare.com/pages/platform/limits/)。Cloudflare 的免费静态请求说明不等同于所有 Functions 或其他 Cloudflare 服务都免费。

## 未来图片生成预算

以下仅以 **GPT Image 1.5、1024 × 1024 输出**为例，不是所有图像模型的统一价格，也不表示该模型必然是届时的默认选择。首版没有接入图片生成。

| 输出质量 | 单张输出费用 | 366 张输出费用 |
| --- | ---: | ---: |
| 低 | $0.009 | $3.294 |
| 中 | $0.034 | $12.444 |
| 高 | $0.133 | $48.678 |

计算方式为单张输出费乘以 366；**未包含输入、编辑、重试或重生成费用**。实际预算应另留迭代空间。模型与价格依据：[GPT Image 1.5 官方文档](https://developers.openai.com/api/docs/models/gpt-image-1.5)。

如果提前生成并把结果作为静态图片展示，访客打开页面不会触发新的图像生成 API 费用；图片传输和存储仍受托管平台限制。使用外部图片时，须确认允许转载并保留出处，不能把“网上公开可见”当作免费再使用许可。

## 未来按需使用 R2

首版不需要对象存储。若未来大量图片不适合继续放在站点内，可评估 Cloudflare R2 Standard：

| 项目 | 每月免费额度 | 超出后单价 |
| --- | ---: | ---: |
| Standard 存储 | 10 GB-month | $0.015 / GB-month |
| Class A 操作 | 100 万次 | $4.50 / 百万次 |
| Class B 操作 | 1,000 万次 | $0.36 / 百万次 |
| 出站流量 | 免费 | 免费 |

存储量与操作次数分别计费；GB-month 表示按月折算的存储占用。以上是 Standard 存储类别的示例，不适用于其他存储类别的全部规则。依据：[Cloudflare R2 官方价格](https://developers.cloudflare.com/r2/pricing/)。

当前预算可以保持为 **$0 托管费、$0 图片生成费**，前提是使用默认免费域名、保持首版无图片且在 GitHub Pages 限制内。新增域名、图片或外部服务后再分别核算。
