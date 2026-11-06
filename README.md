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

### AILHC Fork 维护

本 Fork 定制用户级技能的可信根目录链接，不修改 Claude 或 omp 程序。维护源为本仓提交；运维父仓通过 `vendor/teamai-cli` 子模块固定版本，不在安装副本中打补丁。

本机 `~/.teamai/trusted-skill-links.json` 为 JSON 对象：键是 HOME 直属工具根链接的绝对路径，值是该链接实际目标的规范绝对路径。例如虚拟环境的 `/home/demo/.claude` 对应 `/data/demo-claude`；Windows 路径须按 JSON 转义。只有精确登记且实际目标匹配的根链接才获准，授权同时影响技能写入、清理和卸载；文件缺失、损坏或本身为链接时不放行。项目级链接、技能自身链接及目标内部再次越界仍由原保护机制拒绝。该文件包含机器路径，只留本机，不加入共享团队配置。

升级时在维护工作区获取并合并官方上游，审阅本定制与上游路径守卫的差异，运行 `npm ci`、`npm run build`、`npm run typecheck`、聚焦测试 `npm test -- src/__tests__/trusted-skill-links.test.ts` 和隔离 CLI 分发验证。先提交并推送 Fork，再更新运维父仓的子模块指针与台账；构建产物来自固定提交。官方提供等价可信目标支持并通过回归后，删除本定制，不保留两套实现。真实 Claude 同步须先确认目标和动作；验证不启动 Claude、不使用订阅账号。

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
    <tr><td>Hermes</td><td align="center">✓</td><td align="center">✓¹</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">✓</td><td align="center">—</td><td align="center">✓</td><td align="center">—</td><td align="center">—</td><td align="center">✓</td><td align="center">—</td></tr>
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
