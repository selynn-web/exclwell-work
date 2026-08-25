# 团队档案台 · 独立部署版

不需要 Claude 账号，团队共用一个密码就能进。数据存在你自己的 Supabase 项目里，网站托管在 Vercel。你已经有 Supabase / GitHub / Vercel 账号了，所以这次全程可以在浏览器里点完，不需要打开命令行、不需要装任何软件。

功能和之前的页面完全一样（会议记录 / SOP 管理 / 人员管理 / 产品损毁记录 / 追踪记录），SOP 附件支持任意格式（图片 / PDF / Word），单个文件仍限制 4MB 以内。数据每 20 秒自动刷新一次，别人改的东西你会陆续看到。

## 第一步：在 Supabase 建一张表

1. 打开你的 Supabase 项目。
2. 左边菜单找「SQL Editor」，点「New query」。
3. 把下面这段贴进去，点「Run」：

```sql
create table if not exists kv_store (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
```

跑完不报错就行，这张表就是用来存整个团队档案台数据的。

## 第二步：拿到 Supabase 的连接信息

在同一个项目里，左边菜单「Settings」→「API」，你会看到两样东西：

- **Project URL**（类似 `https://xxxxx.supabase.co`）
- **service_role** 密钥（在「Project API keys」那一块，注意不是 `anon` 那个，是 `service_role`——这个权限比较高，只会用在服务器端，不会暴露给访问网站的人，但你自己也不要把它贴到网站上或者分享出去）

把这两个先复制到记事本备用，等下要填到 Vercel 里。

## 第三步：把代码传到 GitHub

1. 去 github.com 新建一个仓库（New repository），名字随便取，比如 `team-archive`，私有（Private）就行，不用勾选任何初始化选项。
2. 建完之后 GitHub 会显示一个空仓库的引导页，找到「uploading an existing file」这个链接点进去。
3. 把我给你的这个 `team-site` 压缩包解压后，**把里面的东西**（`public` 文件夹、`api` 文件夹、`package.json`、`README.md`、`.gitignore`，注意是这些文件本身，不是外层那层 `team-site` 文件夹）整个拖进浏览器的上传区域。
4. 拖之后确认一下左侧文件树里 `public/` 和 `api/` 是不是两个文件夹（里面还有子文件），如果 GitHub 把它们拆散摊平了，换成用 GitHub Desktop 这个客户端软件（desktop.github.com）操作会更保险——它能完整保留文件夹结构。
5. 拉到底部点「Commit changes」提交。

## 第四步：在 Vercel 导入这个仓库

1. 打开 vercel.com/dashboard，点「Add New」→「Project」。
2. 「Import Git Repository」里找到刚才那个 `team-archive` 仓库，点「Import」（如果没看到，先点「Adjust GitHub App Permissions」把这个仓库的访问权限给 Vercel）。
3. 不用改任何构建设置，往下找到「Environment Variables」，加这四个：

| 名称 | 值 |
|---|---|
| `TEAM_PIN` | 你自己定的团队密码，比如 `soy2026` |
| `AUTH_SECRET` | `3c7e7ab3a6d4f3d2ed16a32d28f79023e81727d7f00ebffd1fbb91a110eaea1e`（直接用这个就行，也可以换成自己的一长串随机字符） |
| `SUPABASE_URL` | 第二步复制的 Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | 第二步复制的 service_role 密钥 |

4. 点「Deploy」，等一两分钟。

## 第五步：打开使用

部署完成后 Vercel 会给你一个网址（类似 `https://team-archive-xxxx.vercel.app`）。打开它，输入你在第三步设的 `TEAM_PIN`，就能进去用了。把网址和密码发给团队成员，他们打开、输密码即可，不需要注册任何账号。

## 以后要改功能怎么办

之后有新需求告诉我，我把改好的文件发给你，你回到 GitHub 那个仓库页面，用同样的「Upload files」方式把改动过的文件重新拖上去覆盖、提交——Vercel 检测到 GitHub 仓库有新提交会自动重新部署，你不需要再去 Vercel 那边点任何东西。这一步也只能由你（或团队里管这个仓库的人）来做，我这边没有权限直接帮你们推送代码。

## 遇到问题

- 打开网站一直转圈或报错：多半是第四步的四个环境变量哪个填错了或漏填了，回 Vercel 项目的「Settings → Environment Variables」检查，改完后需要重新部署一次（项目页面「Deployments」标签，点最新那条右边的「···」→「Redeploy」）。
- 输入密码提示"服务器未配置"：说明 `TEAM_PIN` 或 `AUTH_SECRET` 没设对。
- 保存数据时报错：多半是 Supabase 那两个值填错了，或者第一步的表没建成功，回 Supabase 的「Table Editor」确认能看到 `kv_store` 这张表。
- 忘记密码了：回 Vercel 环境变量把 `TEAM_PIN` 改掉，重新部署一次，新密码告诉大家就行，不影响已保存的数据。
