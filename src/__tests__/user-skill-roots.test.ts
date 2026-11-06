import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { lstat, mkdir, mkdtemp, readdir, readFile, realpath, rmdir, symlink, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { SkillsHandler } from '../resources/skills.js';
import { builtinSkillsTarget } from '../builtin-skills.js';
import type { LocalConfig, ResourceItem, TeamaiConfig } from '../types.js';

let base: string;
let home: string;
let external: string;
let team: TeamaiConfig;
let local: LocalConfig;
let item: ResourceItem;
const linkType = process.platform === 'win32' ? 'junction' : 'dir';

async function removeTree(file: string): Promise<void> {
  const info = await lstat(file);
  if (!info.isDirectory() || info.isSymbolicLink()) {
    await unlink(file);
    return;
  }
  for (const entry of await readdir(file)) await removeTree(path.join(file, entry));
  await rmdir(file);
}

beforeEach(async () => {
  const temp = path.resolve('.tmp/user-skill-roots');
  await mkdir(temp, { recursive: true });
  base = await mkdtemp(path.join(temp, 'case-'));
  home = path.join(base, 'home');
  external = path.join(base, 'external');
  const repo = path.join(base, 'team');
  const source = path.join(repo, 'skills', 'fixture');
  await mkdir(home);
  await mkdir(external);
  await mkdir(source, { recursive: true });
  await writeFile(path.join(source, 'SKILL.md'), '---\nname: fixture\ndescription: fixture\n---\nversion one\n');
  vi.stubEnv('HOME', home);
  vi.stubEnv('USERPROFILE', home);
  team = {
    team: 'fixture', description: '', repo, provider: 'git', reviewers: [],
    sharing: { skills: {}, rules: { enforced: [] }, docs: { localDir: '' }, env: { injectShellProfile: false } },
    toolPaths: { claude: { skills: '.claude/skills' }, omp: { skills: '.omp/skills', userScope: { skills: '.omp/agent/skills' } } },
  };
  local = { repo: { localPath: repo, remote: repo }, username: 'fixture', updatePolicy: 'auto', additionalRoles: [], scope: 'user' };
  item = { name: 'fixture', type: 'skills', sourcePath: source, relativePath: 'skills/fixture' };
});

afterEach(async () => {
  vi.unstubAllEnvs();
  await removeTree(base);
});

describe('用户工具根目录迁移', () => {
  it.each(['claude', 'omp'])('%s 根链接可迁出 HOME，无须额外登记，内置技能使用同一边界', async (tool) => {
    local.enabledAgents = [tool];
    const root = path.join(home, `.${tool}`);
    await symlink(external, root, linkType);
    if (tool === 'omp') await mkdir(path.join(external, 'agent'));
    const leaf = tool === 'omp' ? 'agent/skills' : 'skills';
    const target = path.join(external, leaf, 'fixture', 'SKILL.md');
    await new SkillsHandler().pullItem(item, team, local);
    expect(await readFile(target, 'utf8')).toBe(await readFile(path.join(item.sourcePath, 'SKILL.md'), 'utf8'));
    const builtin = await builtinSkillsTarget(tool, team, local);
    if (!builtin) throw new Error('缺少内置技能分发目标');
    const relative = path.relative(await realpath(builtin.guardBase), path.dirname(target));
    expect(relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)).toBe(false);
  });

  it('普通目录仍交付相同内容', async () => {
    local.enabledAgents = ['claude'];
    await mkdir(path.join(home, '.claude'));
    await new SkillsHandler().pullItem(item, team, local);
    expect(await readFile(path.join(home, '.claude/skills/fixture/SKILL.md'), 'utf8')).toBe(await readFile(path.join(item.sourcePath, 'SKILL.md'), 'utf8'));
  });

  it('未迁移工具根时保留 HOME 内既有的共享技能链接', async () => {
    local.enabledAgents = ['claude'];
    await mkdir(path.join(home, '.claude'));
    const shared = path.join(home, '.agents/skills');
    await mkdir(shared, { recursive: true });
    await symlink(shared, path.join(home, '.claude/skills'), linkType);
    await new SkillsHandler().pullItem(item, team, local);
    expect(await readFile(path.join(shared, 'fixture/SKILL.md'), 'utf8')).toBe(await readFile(path.join(item.sourcePath, 'SKILL.md'), 'utf8'));
  });

  it('工具根内部的 skills 链接不能再次越界', async () => {
    local.enabledAgents = ['claude'];
    await symlink(external, path.join(home, '.claude'), linkType);
    const outside = path.join(base, 'unrelated');
    await mkdir(outside);
    await writeFile(path.join(outside, 'sentinel'), 'keep');
    await symlink(outside, path.join(external, 'skills'), linkType);
    expect(await new SkillsHandler().deliveryTargets(team, local, item)).toEqual([]);
    expect(await readFile(path.join(outside, 'sentinel'), 'utf8')).toBe('keep');
  });

  it('项目级根链接仍不能越出项目', async () => {
    const project = path.join(base, 'project');
    await mkdir(project);
    local.scope = 'project';
    local.projectRoot = project;
    local.enabledAgents = ['claude'];
    await symlink(external, path.join(project, '.claude'), linkType);
    expect(await new SkillsHandler().deliveryTargets(team, local, item)).toEqual([]);
  });

  it('技能自身的链接仍属于用户，不覆盖链接目标', async () => {
    local.enabledAgents = ['claude'];
    await symlink(external, path.join(home, '.claude'), linkType);
    await mkdir(path.join(external, 'skills'));
    const member = path.join(base, 'member');
    await mkdir(member);
    await writeFile(path.join(member, 'SKILL.md'), 'private');
    await symlink(member, path.join(external, 'skills/fixture'), linkType);
    await new SkillsHandler().pullItem(item, team, local);
    expect(await readFile(path.join(member, 'SKILL.md'), 'utf8')).toBe('private');
    expect((await lstat(path.join(external, 'skills/fixture'))).isSymbolicLink()).toBe(true);
  });

  it('沿用既有 Claude 自定义根记录，不需要另一份路径配置', async () => {
    local.enabledAgents = ['claude'];
    const configured = path.join(home, '.claude-official');
    local.toolRoots = { claude: configured };
    await symlink(external, configured, linkType);
    await new SkillsHandler().pullItem(item, team, local);
    expect(await readFile(path.join(external, 'skills/fixture/SKILL.md'), 'utf8')).toBe(await readFile(path.join(item.sourcePath, 'SKILL.md'), 'utf8'));
    expect(await new SkillsHandler().deliveryTargets(team, local, item)).toEqual([
      expect.objectContaining({ dest: path.join(configured, 'skills', 'fixture'), tool: 'claude' }),
    ]);
  });

  it('沿用 omp 已选择的 profile 根目录', async () => {
    local.enabledAgents = ['omp'];
    vi.stubEnv('OMP_PROFILE', 'work');
    await symlink(external, path.join(home, '.omp'), linkType);
    await mkdir(path.join(external, 'profiles/work/agent'), { recursive: true });
    await new SkillsHandler().pullItem(item, team, local);
    expect(await readFile(path.join(external, 'profiles/work/agent/skills/fixture/SKILL.md'), 'utf8')).toBe(await readFile(path.join(item.sourcePath, 'SKILL.md'), 'utf8'));
  });

  it.each(['broken', 'loop'])('根链接 %s 时没有可写目标并保留原链接', async (kind) => {
    local.enabledAgents = ['claude'];
    const root = path.join(home, '.claude');
    await symlink(kind === 'loop' ? root : path.join(base, 'missing'), root, linkType);
    const targets = await new SkillsHandler().deliveryTargets(team, local, item).catch((error: NodeJS.ErrnoException) => {
      expect(['ENOENT', 'ELOOP']).toContain(error.code);

      return [];
    });

    expect(targets).toEqual([]);
    expect((await lstat(root)).isSymbolicLink()).toBe(true);
  });
});
