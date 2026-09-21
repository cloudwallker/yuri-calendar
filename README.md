# 百合日历

一个公开的、固定展示 366 天的百合主题日历。采用浅色米白、淡紫和粉色界面，使用 HTML、CSS 与 JavaScript ES modules，没有运行时依赖或后端。

首版提供月导航、回到今天、日期详情弹窗，以及 `#MM-DD` 形式的日期链接。2 月 29 日始终保留；首版不包含图片和事件，`data/events.json` 保持为空。

项目仓库：[`cloudwallker/yuri-calendar`](https://github.com/cloudwallker/yuri-calendar)。站点地址：[百合日历](https://cloudwallker.github.io/yuri-calendar/)。发布状态可在仓库的 Pages 设置和 Actions 中查看。

## 本地运行与测试

安装 Node.js 22 或更新版本后，在项目根目录运行：

```sh
npm run dev
```

打开 [http://127.0.0.1:4173](http://127.0.0.1:4173)。运行页面和日期单元测试无需安装依赖。请通过本地 HTTP 服务访问，避免直接双击 HTML 时浏览器对模块和 JSON 请求的限制。

运行自动化测试：

```sh
npm test
```

浏览器验收使用开发依赖 Playwright（不随页面加载）。本机安装 Chrome 后运行：

```sh
npm ci
npm run test:browser
```

该命令检查桌面与手机布局、日期弹窗、键盘关闭、刷新、前进后退和今日标记，并将截图保存在被 Git 忽略的 `.local/` 中。

“今天”按北京时间（Asia/Shanghai）计算。

使用月导航查看全年日期；选择日期后打开详情弹窗，也可通过地址片段直接定位，例如 `#02-29`。点击“今天”回到当前日期。

## 文件结构

```text
index.html          页面入口
assets/styles.css   样式
assets/app.js       页面交互
assets/calendar.js  日历与日期逻辑
data/events.json    事件数据，首版为空
scripts/serve.mjs   本地静态服务器
package.json        开发与测试命令
.nojekyll           GitHub Pages 静态发布标记
docs/costs.md       托管与未来图片成本说明
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

图片应提前准备并作为静态资源展示。公开可浏览不等于可以免费转载，采用外部图片前需要确认转载许可并保留出处。AI 图片生成和存储的预算示例见 [成本说明](docs/costs.md)。

## 未来迁移至 Cloudflare Pages

现有文件可直接作为静态站点部署。需要迁移时，在 Cloudflare Pages 连接该仓库，选择 `main` 作为生产分支，不使用框架预设或构建命令，将项目根目录设为发布目录。部署后检查资源路径、日期链接与交互，再按需绑定自定义域名。

当前无需 Functions、数据库或 R2。只有后续资源规模或访问需求确实需要时，再评估额外服务；域名、图片生成与存储费用分别计算。
