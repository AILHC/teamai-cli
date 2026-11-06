<p align="center">
  <img src="assets/teamai-cli-logo.svg" alt="teamai-cli">
</p>

<h1 align="center">TeamAI — Make Every Team AI Native</h1>

<p align="center">
  <a href="https://trendshift.io/repositories/123184?utm_source=repository-badge&amp;utm_medium=badge&amp;utm_campaign=badge-repository-123184" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/repositories/123184" alt="Tencent%2Fteamai-cli | Trendshift" width="250" height="55"/></a>
</p>

<p align="center">
  <a href="README.md">English</a> | <a href="README.zh-CN.md">中文</a> | <a href="README.ja.md">日本語</a> | <a href="README.ko.md">한국어</a> | <a href="README.th.md">ไทย</a>
</p>

<p align="center">
  <a href="https://github.com/Tencent/teamai-cli/actions/workflows/ci.yml"><img src="https://github.com/Tencent/teamai-cli/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/teamai-cli"><img src="https://img.shields.io/npm/v/teamai-cli.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/teamai-cli"><img src="https://img.shields.io/npm/dm/teamai-cli.svg" alt="npm downloads"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

**TeamAI manages a team's skills, rules, agents, learnings, models, MCP, and other AI assets in a git repo.**

A teammate initializes once. After that, the latest team AI assets sync automatically.

### AILHC 稳定版维护入口

本 Fork 的 `my-main` 基于官方 `v0.29.0`，定制版本为 `0.29.0-hc.1`；运维父仓通过 `vendor/teamai-cli` 固定源码提交。用户级工具根目录可迁移到 HOME 外，软链接和 Windows junction 由既有路径解析处理，不需要新增授权文件或逐个登记。技能根内部再次越界、项目级越界及用户文件归属保护不变。本次不定制 Claude 或 omp 程序。

维护时在获准的维护工作区获取官方上游并合并选定稳定版，运行 `npm ci`、`npm run typecheck`、`npm run lint`、`npm run build` 及用户工具根回归测试，再用虚拟 HOME 和假仓库验证真实 CLI 的分发、更新、清理、卸载与私有文件保留。先推送 Fork，后更新父仓子模块指针与台账；从固定提交构建安装包，不改安装副本。每次部署记录版本、源码 SHA、包摘要、回退包及逐机器结果；官方等价支持通过回归后删除本补丁。

真实 Claude 的文件同步须事先列出目标和动作，验证不启动 Claude、不使用订阅账号。隔离验证通过不等于正式宿主加载或用户验收。

## Why TeamAI

<p align="center">
  <img src="assets/use-cases.png" alt="Eight everyday scenarios, before and after TeamAI" width="100%">
</p>

## Quick Start

Send this one line to your AI tool:

```text
Install the teamai skill: https://github.com/Tencent/teamai-cli/tree/main/skills/teamai , load the teamai skill, then set up TeamAI for my team from scratch.
```

Once TeamAI is set up, just talk to the `/teamai` skill in your AI tool:

**Set up a team from scratch**

```text
/teamai Help me set up TeamAI for my team from scratch
```

**Join a team**

```text
/teamai Help me join my team's TeamAI, repo URL is https://github.com/your-org/your-repo
```

**Share with the team**

Skills, rules, MCP servers, and other agent resources can all be shared:

```text
/teamai Share my xxx skill with the team
```

**Open the dashboard**

```text
/teamai Open the TeamAI dashboard
```

Once a teammate is set up, they just open their agent and already have the team's full set of AI assets.

<details>
<summary>Command-line install</summary>

### Install

```bash
npm install -g teamai-cli
```

### Team admin / solo user

Create a shared repo on your git host (GitHub, GitLab, GitCode, CNB, TGit, or a private Git service). Give teammates permission to push branches, and leave the default branch protected. Then run `teamai init https://github.com/your-org/your-repo`.

> **No team repo yet?** Start from a template pre-loaded with production-ready skills, rules, and review agents. Browse the [teamai-hub](https://github.com/teamai-hub) org, click **Fork**, then `teamai init` against your new repo.

### Team members

```bash
# Choose one, depending on where you want resources installed

# Workspace-scope init (default, resources installed under the workspace directory)
cd /path/to/my-workspace
teamai init https://github.com/your-org/your-repo

# Or, user-scope init (resources installed under ~/)
teamai init https://github.com/your-org/your-repo --scope user
```

Once initialized, every AI session automatically pulls the latest skills / rules and other Harness updates published by admins — no manual sync needed.

</details>

## Product Overview

Three layers of capability, built on Git:

- **Team Execution** — make every agent work the team's way: skills, rules, culture, agents, hooks, MCP, workflows, env, models.
- **Team Context** (beta) — make every agent understand the team: learnings, codebase graph, teamwiki.
- **Team Improvement** (beta) — make every execution improve the team: usage, sessions, scorers, benchmarks.

<table>
  <thead>
    <tr>
      <th rowspan="2">Agent</th>
      <th colspan="9">Team Execution</th>
      <th rowspan="2">Team Context (beta)</th>
      <th colspan="4">Team Improvement (beta)</th>
    </tr>
    <tr>
      <th>skills</th><th>rules</th><th>culture</th><th>agents</th><th>hooks</th><th>mcp</th><th>workflows</th><th>env</th><th>models</th>
      <th>usage</th><th>sessions</th><th>scorers</th><th>benchmarks</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Claude Code</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td></tr>
    <tr><td>Codex</td><td align="center">✓</td><td align="center">✓¹</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td></tr>
    <tr><td>Cursor</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td></tr>
    <tr><td>CodeBuddy</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td></tr>
    <tr><td>WorkBuddy</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td></tr>
    <tr><td>GitHub Copilot CLI</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓³</td><td align="center">—</td></tr>
    <tr><td>OpenCode</td><td align="center">✓</td><td align="center">✓¹</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td></tr>
    <tr><td>Pi Coding Agent</td><td align="center">✓</td><td align="center">✓¹</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓²</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">—</td></tr>
    <tr><td>Oh My Pi</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">—</td></tr>
    <tr><td>OpenClaw</td><td align="center">✓</td><td align="center">✓¹</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">—</td><td align="center">—</td><td align="center">✓³</td><td align="center">—</td></tr>
    <tr><td>Hermes</td><td align="center">✓</td><td align="center">✓¹</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">—</td><td align="center">—</td><td align="center">✓³</td><td align="center">—</td></tr>
    <tr><td>DeepSeek Harness</td><td align="center">✓</td><td align="center">✓¹</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓²</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓³</td><td align="center">—</td></tr>
    <tr><td>Qoder</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td></tr>
    <tr><td>Qoder CN</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td></tr>
    <tr><td>Kiro</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓³</td><td align="center">—</td></tr>
    <tr><td>Trae</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">—</td><td align="center">—</td><td align="center">✓³</td><td align="center">—</td></tr>
    <tr><td>Trae CN</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">—</td><td align="center">—</td><td align="center">✓³</td><td align="center">—</td></tr>
    <tr><td>ZCode</td><td align="center">✓</td><td align="center">✓¹</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓²</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓³</td><td align="center">—</td></tr>
    <tr><td>JoyCode</td><td align="center">✓</td><td align="center">✓¹</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td></tr>
    <tr><td>Muse Code</td><td align="center">✓</td><td align="center">✓¹</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td></tr>
    <tr><td>Antigravity</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td><td align="center">✓</td></tr>
  </tbody>
</table>

<sup>✓¹</sup> Rules stay on. They are not limited by path.

<sup>✓²</sup> Env reaches it only through `teamai env exec`.

<sup>✓³</sup> Only workflows run with the skill driver are scored.

## Learn More

- [Getting Started](docs/guide/getting-started.md) — set up a team, join one, or share a skill
- [Usage Guide](docs/usage-guide.md) — setup, onboarding, daily workflows, and commands
- [Product Overview](docs/product-overview.md) — architecture, distribution controls, and capability details
- [Git Providers](docs/guide/providers.md) — supported repository providers
- [Windows Setup](docs/guide/windows.md) — hooks and shell configuration
- [Technical Designs](docs/designs/README.md) — design documents and proposals

## Contributors

Thanks to everyone who has contributed to TeamAI!

<a href="https://github.com/Tencent/teamai-cli/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Tencent/teamai-cli" alt="Contributors" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## Contributing

Join the conversation, or open an issue or PR. See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for how to contribute.

## License

[MIT](LICENSE)
