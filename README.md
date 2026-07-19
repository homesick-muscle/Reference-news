# GitHub Actions + 飞书会议提醒

这是一套不依赖本地电脑开机的云端版会议提醒方案。  
只要 GitHub Actions 正常运行，你的电脑关机，手机飞书也能收到提醒。

## 目录

- `conferences.json`
  会议清单、官方监测页、地点/票价/报名时间/开会时间等基线信息
- `state.json`
  上次抓取状态，用于判断官网是否有变化
- `monitor_conferences_cloud.py`
  抓取官网、比较状态、生成中文提醒、发送飞书
- `.github/workflows/conference-alerts.yml`
  GitHub Actions 定时任务

## 运行逻辑

- 每天北京时间 `09:00` 和 `19:00` 检查一次
- GitHub Actions 的 cron 用的是 `UTC`
  - `01:00 UTC` = `09:00 Asia/Shanghai`
  - `11:00 UTC` = `19:00 Asia/Shanghai`
- 第一次运行只初始化 `state.json`，不发提醒
- 后续运行：
  - 有官网变化：发 `【新资讯】`
  - 没有官网变化：如果最近一个月内仍有报名中/即将截止/正在进行的会议，发 `【未更新】`

## 你要做的事

### 1. 建一个 GitHub 仓库

建议仓库名：

- `conference-alerts`

### 2. 把本目录内容上传到仓库根目录

需要上传这些文件和目录：

- `.github/workflows/conference-alerts.yml`
- `conferences.json`
- `state.json`
- `monitor_conferences_cloud.py`
- `.gitignore`

### 3. 配 GitHub Secret

在 GitHub 仓库里进入：

- `Settings`
- `Secrets and variables`
- `Actions`
- `New repository secret`

新增：

- `FEISHU_WEBHOOK_URL`

值填你现在的飞书机器人 Webhook。

### 4. 打开 Actions 权限

确认仓库允许 GitHub Actions 写回仓库内容。

如果默认是只读，需要允许：

- `Workflow permissions`
- `Read and write permissions`

原因是 workflow 需要把更新后的 `state.json` 提交回仓库。

### 5. 手动跑第一次

进入：

- `Actions`
- `Conference Alerts`
- `Run workflow`

第一次主要是初始化 `state.json`。

### 6. 第二次开始正式工作

第二次起就会：

- 检测官网变化
- 推送飞书
- 更新 `state.json`

## 本地测试

如果你想先在本地看输出：

```powershell
cd F:\conference_alerts_cloud
py .\monitor_conferences_cloud.py --dry-run
```

如果你想本地模拟首次初始化：

```powershell
cd F:\conference_alerts_cloud
py .\monitor_conferences_cloud.py --bootstrap
```

## 注意

- GitHub Actions 定时任务可能会有几分钟漂移，不是秒级触发
- 某些官网可能会拦截 GitHub 云端 IP，届时会被脚本识别成“官方页面访问异常”
- `conferences.json` 里的地点、票价、报名时间是当前基线信息，后续你可以继续手动修正
