import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const markdownLink = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+['"][^)]*['"])?\)/g;

async function findMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return findMarkdownFiles(target);
    return entry.isFile() && entry.name.endsWith('.md') ? [target] : [];
  }));
  return nested.flat();
}

function isExternal(target) {
  return target.startsWith('#') || target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:');
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

const files = [path.join(root, 'README.md'), ...(await findMarkdownFiles(path.join(root, 'docs')))];
const failures = [];

for (const file of files) {
  const content = await readFile(file, 'utf8');
  for (const match of content.matchAll(markdownLink)) {
    const rawTarget = match[1].replace(/^<|>$/g, '');
    if (isExternal(rawTarget)) continue;
    const target = rawTarget.split('#', 1)[0].split('?', 1)[0];
    if (!target || await exists(path.resolve(path.dirname(file), target))) continue;
    failures.push(`${path.relative(root, file)} → ${rawTarget}`);
  }
}

if (failures.length) {
  console.error('Broken local Markdown links:\n' + failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Checked local Markdown links in ${files.length} files.`);
