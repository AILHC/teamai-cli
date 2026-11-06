import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { lstat, mkdir, mkdtemp, readdir, rmdir, symlink, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { findSkillDirectoryBlock } from '../resources/skills.js';

let base: string;
let home: string;
let root: string;
let link: string;
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

async function trust(target = root): Promise<void> {
  await writeFile(path.join(home, '.teamai', 'trusted-skill-links.json'), JSON.stringify({ [link]: target }));
}

beforeEach(async () => {
  const temp = path.resolve('.tmp/trusted-skill-links');
  await mkdir(temp, { recursive: true });
  base = await mkdtemp(path.join(temp, 'case-'));
  home = path.join(base, 'home');
  root = path.join(base, 'outside');
  link = path.join(home, '.claude');
  await mkdir(path.join(home, '.teamai'), { recursive: true });
  await mkdir(path.join(root, 'skills'), { recursive: true });
  await symlink(root, link, linkType);
  vi.stubEnv('HOME', home);
  vi.stubEnv('USERPROFILE', home);
});

afterEach(async () => {
  vi.unstubAllEnvs();
  await removeTree(base);
});

describe('本机明确登记的技能根目录链接', () => {
  it('允许用户根目录中明确登记的链接及固定目标', async () => {
    await trust();
    expect(await findSkillDirectoryBlock(home, path.join(link, 'skills', 'probe'))).toBeNull();
  });

  it('未登记时仍拒绝 HOME 外链接', async () => {
    expect(await findSkillDirectoryBlock(home, path.join(link, 'skills', 'probe'))).toMatchObject({ kind: 'link-outside-base' });
  });

  it('登记目标与实际目标不同则拒绝', async () => {
    await trust(path.join(base, 'other'));
    expect(await findSkillDirectoryBlock(home, path.join(link, 'skills', 'probe'))).toMatchObject({ kind: 'link-outside-base' });
  });

  it('登记损坏则拒绝，不默认放行', async () => {
    await writeFile(path.join(home, '.teamai', 'trusted-skill-links.json'), '{invalid');
    expect(await findSkillDirectoryBlock(home, path.join(link, 'skills', 'probe'))).toMatchObject({ kind: 'link-outside-base' });
  });

  it('根目录已登记也拒绝目标内部再次越界', async () => {
    await trust();
    const other = path.join(base, 'untrusted');
    await mkdir(other);
    await symlink(other, path.join(root, 'skills', 'redirect'), linkType);
    expect(await findSkillDirectoryBlock(home, path.join(link, 'skills', 'redirect', 'probe'))).toMatchObject({ kind: 'link-outside-base' });
  });

  it('根目录已登记也不接管技能自身的链接', async () => {
    await trust();
    const other = path.join(base, 'member-skill');
    await mkdir(other);
    await symlink(other, path.join(root, 'skills', 'probe'), linkType);
    expect(await findSkillDirectoryBlock(home, path.join(link, 'skills', 'probe'))).toMatchObject({ kind: 'members-link' });
  });

  it('本机登记不能放开项目级链接', async () => {
    const project = path.join(base, 'project');
    await mkdir(project);
    const projectLink = path.join(project, '.claude');
    await symlink(root, projectLink, linkType);
    await writeFile(path.join(home, '.teamai', 'trusted-skill-links.json'), JSON.stringify({ [projectLink]: root }));
    expect(await findSkillDirectoryBlock(project, path.join(projectLink, 'skills', 'probe'))).toMatchObject({ kind: 'link-outside-base' });
  });

  it('拒绝链接形式的授权文件', async () => {
    const data = path.join(base, 'policy.json');
    await writeFile(data, JSON.stringify({ [link]: root }));
    await symlink(data, path.join(home, '.teamai', 'trusted-skill-links.json'), 'file');
    expect(await findSkillDirectoryBlock(home, path.join(link, 'skills', 'probe'))).toMatchObject({ kind: 'link-outside-base' });
  });
});
