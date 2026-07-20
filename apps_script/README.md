# Google Apps Script 云端版

这是一套不依赖电脑、也不依赖 GitHub Actions 的云端定时方案。

## 你要做的

1. 打开 [Google Apps Script](https://script.google.com/)
2. 新建一个项目
3. 把 `apps_script/Code.gs` 的内容完整粘贴进去
4. 在项目设置里把时区设成 `Asia/Shanghai`
5. 在 `Project Settings > Script Properties` 里新增：
   - `FEISHU_WEBHOOK_URL` = 你的飞书机器人 Webhook
6. 先手动运行一次 `bootstrap`
7. 再手动运行一次 `setup`

## 触发时间

- 上午：北京时间 `09:40`
- 晚上：北京时间 `19:07`

## 说明

- 首次运行只会初始化状态，不发消息
- 以后有官网变化发 `【新资讯】`
- 没有变化但最近一个月仍需关注的会发 `【未更新】`
- 页面临时访问失败只记日志，不再误发消息

## 可手动测试

运行 `sendTest` 可以立刻给飞书发一条测试消息。

