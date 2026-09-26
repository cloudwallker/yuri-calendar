# 百合日历

### A yuri-themed calendar with a place for all 366 dates

**Browse the year by month, open a date's detail dialog, and share it with a `#MM-DD` link. February 29 is always included, and today follows Beijing time.**

**按月浏览全年 366 个日期，打开日期详情，并通过 `#MM-DD` 链接分享某一天。始终保留 2 月 29 日，按北京时间定位今天。**

A public static calendar with no backend or runtime dependencies. The current version contains no event entries or images; `data/events.json` is empty.

这是一个公开的百合主题静态日历，采用米白、淡紫和粉色界面，没有后端或运行时依赖。当前版本不包含事件内容和图片，`data/events.json` 保持为空。

[Open calendar / 打开日历](https://cloudwallker.github.io/yuri-calendar/) · [Run locally / 本地运行](#本地运行)

项目仓库：[`cloudwallker/yuri-calendar`](https://github.com/cloudwallker/yuri-calendar)。站点地址：[百合日历](https://cloudwallker.github.io/yuri-calendar/)。发布状态可在仓库的 Pages 设置和 Actions 中查看。

## 本地运行

安装 Node.js 22 或更新版本后，在项目根目录运行：

```sh
npm run dev
```

打开 [http://127.0.0.1:4173](http://127.0.0.1:4173)。请通过本地 HTTP 服务访问，避免直接双击 HTML 时浏览器对模块和 JSON 请求的限制。

“今天”按北京时间（Asia/Shanghai）计算，与访问者设备时区无关。直接打开首页会自动定位到当月并打开当天的日期详情；已有 `#MM-DD` 分享链接优先显示指定日期。关闭弹窗后可以继续浏览全年，刷新不带日期的首页则再次显示当天。

使用月导航查看全年日期；选择日期后打开详情弹窗，也可通过地址片段直接定位，例如 `#02-29`。点击“今天”回到当前日期。

## 文件结构

```text
index.html          页面入口
assets/styles.css   样式
assets/app.js       页面交互
assets/calendar.js  日历与日期逻辑
data/events.json    事件数据，首版为空
scripts/serve.mjs   本地静态服务器
package.json        本地运行命令
.nojekyll           GitHub Pages 静态发布标记
```

## 发布到 GitHub Pages

1. 创建公开仓库 `cloudwallker/yuri-calendar`，将项目文件提交并推送至 `main` 分支。入口 `index.html` 和 `.nojekyll` 应位于仓库根目录。
2. 在仓库 **Settings → Pages → Build and deployment** 中，将 **Source** 设为 **Deploy from a branch**。
3. 选择分支 **main**、目录 **/ (root)**，保存。
4. 等待 GitHub 完成部署，再访问目标地址。可在仓库 **Actions** 中查看发布进度与错误。

后续更新提交并推送至 `main` 即可触发重新发布。部署后应检查月份切换、今天按钮、日期弹窗，以及带 `#02-29` 的直接访问链接。仓库与网址都是公开的，请只提交适合公开的数据。

## 事件与图片的后续扩展

首版没有事件录入界面、事件内容或图片生成流程。后续事件将保留真实发生年份；查看某一天时，计划展示同月同日、今年及此前 19 年内的事件，并按真实年份降序排列。

事件数据应表达真实日期、标题、说明和来源链接；若包含图片，还需记录图片路径、出处及允许转载的依据。字段和校验规则应在接入事件展示时确定，不能仅凭示例数据假定录入功能已经实现。

图片应提前准备并作为静态资源展示。公开可浏览不等于可以免费转载，采用外部图片前需要确认转载许可并保留出处。

## 未来迁移至 Cloudflare Pages

现有文件可直接作为静态站点部署。需要迁移时，在 Cloudflare Pages 连接该仓库，选择 `main` 作为生产分支，不使用框架预设或构建命令，将项目根目录设为发布目录。部署后检查资源路径、日期链接与交互，再按需绑定自定义域名。

当前无需 Functions、数据库或 R2。只有后续资源规模或访问需求确实需要时，再评估额外服务；域名、图片生成与存储费用分别计算。
