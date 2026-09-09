#!/usr/bin/env node
// MOL-4471: mechanical @angular/flex-layout -> CSS class conversion.
//
// Rewrites every `fxLayout*` / `fxFlex*` attribute (static and `.lt-md`) in the Angular templates
// under src/ into the utility classes defined in src/styles/_layout.scss. Attributes the mapping
// does not know are left in place and reported so they can be converted by hand.
//
//   node docs/upgrade/MOL-4471/14-to-15/tools/flex-layout-convert.js [srcDir]
const fs = require('fs');
const path = require('path');

const root = process.argv[2] || 'src';
const TAG_RE = /<([a-zA-Z][\w-]*)((?:\s+[^\s=>"'\/]+(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/g;
const ATTR_RE = /([^\s=>"'\/]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;

const unmapped = [];
let converted = 0;

function layoutClasses(value, suffix) {
  const [dir, wrap] = value.trim().split(/\s+/);
  const out = [];
  const name = dir === 'row' ? 'row' : dir === 'column' ? 'col' : dir === 'column-reverse' ? 'col-reverse' : null;
  if (!name || (wrap && wrap !== 'wrap')) return null;
  if (suffix) {
    if (name === 'row') return null;
    out.push(`mol-flex-${name}--${suffix}`);
  } else {
    if (name === 'col-reverse') return null;
    out.push(`mol-flex-${name}`);
    if (wrap) out.push('mol-flex-wrap');
  }
  return out;
}

function gapClasses(value, suffix) {
  const [gap, grid] = value.trim().split(/\s+/);
  const m = /^(\d+)px$/.exec(gap);
  if (!m || (grid && grid !== 'grid')) return null;
  if (grid) return null; // grid gaps are converted by hand (component-owned styles)
  return [`mol-gap-${m[1]}${suffix ? `--${suffix}` : ''}`];
}

function alignClasses(value, suffix) {
  const [main, cross] = value.trim().split(/\s+/);
  const justify = { start: 'start', 'flex-start': 'start', center: 'center', end: 'end', 'flex-end': 'end', 'space-between': 'between' };
  const align = { start: 'start', 'flex-start': 'start', center: 'center', end: 'end', 'flex-end': 'end', stretch: 'stretch' };
  const j = justify[main] || (main === 'stretch' ? 'start' : null);
  const a = align[cross || 'stretch'];
  if (!j || !a) return null;
  const s = suffix ? `--${suffix}` : '';
  return [`mol-justify-${j}${s}`, `mol-align-${a}${s}`];
}

function flexClasses(value, suffix) {
  const v = value.trim();
  if (suffix) {
    if (v === 'auto' || v === '1 1 auto') return [`mol-flex-auto--${suffix}`];
    return null;
  }
  if (v === '') return ['mol-flex'];
  let m;
  if ((m = /^(\d+) 1 0$/.exec(v))) return [`mol-flex-${m[1]}-1-0`];
  if ((m = /^(\d+)px$/.exec(v))) return [`mol-flex-basis-${m[1]}`];
  if ((m = /^0 0 (\d+)px$/.exec(v))) return [`mol-flex-fixed-${m[1]}`];
  if (v === '100') return ['mol-flex-100'];
  return null;
}

function mapAttr(name, value) {
  const [base, suffix] = name.split('.');
  if (suffix && suffix !== 'lt-md') return null;
  switch (base) {
    case 'fxLayout': return layoutClasses(value, suffix);
    case 'fxLayoutGap': return gapClasses(value, suffix);
    case 'fxLayoutAlign': return alignClasses(value, suffix);
    case 'fxFlex': return flexClasses(value === undefined ? '' : value, suffix);
    default: return undefined; // not a flex-layout attribute
  }
}

function rewriteTag(whole, tag, attrs, selfClose, file) {
  if (!/\bfx(Layout|Flex)/.test(attrs)) return whole;
  const added = [];
  let classAttr = null;
  const kept = [];
  let m;
  ATTR_RE.lastIndex = 0;
  const raw = attrs;
  const parts = [];
  while ((m = ATTR_RE.exec(raw)) !== null) {
    if (!m[0].trim()) continue;
    parts.push({ text: m[0], name: m[1], value: m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4] });
  }
  for (const p of parts) {
    if (/^\[?fx(Layout|Flex)/.test(p.name)) {
      const bare = p.name.replace(/^\[|\]$/g, '');
      if (bare !== p.name) { unmapped.push({ file, attr: p.text, reason: 'bound' }); kept.push(p); continue; }
      const classes = mapAttr(bare, p.value);
      if (classes === undefined) { kept.push(p); continue; }
      if (classes === null) { unmapped.push({ file, attr: p.text, reason: 'no mapping' }); kept.push(p); continue; }
      added.push(...classes);
      converted++;
      continue;
    }
    if (p.name === 'class') { classAttr = p; continue; }
    kept.push(p);
  }
  if (!added.length) return whole;
  const existing = classAttr ? classAttr.value.trim().split(/\s+/).filter(Boolean) : [];
  const merged = [...existing, ...added.filter(c => !existing.includes(c))];
  const classText = `class="${merged.join(' ')}"`;
  // Put class first when it was not already present so the template keeps a stable shape.
  const rebuilt = classAttr ? [] : [classText];
  let seenClass = false;
  for (const p of parts) {
    if (p === classAttr) { rebuilt.push(classText); seenClass = true; continue; }
    if (kept.includes(p)) rebuilt.push(p.text);
  }
  const multiline = /\n/.test(raw);
  const sep = multiline ? raw.match(/\n\s*/)[0] : ' ';
  return `<${tag} ${rebuilt.join(sep)}${selfClose ? ' /' : ''}>`;
}

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(root, []).filter(f => f.endsWith('.html') || (f.endsWith('.ts') && !f.endsWith('.spec.ts')));
const touched = [];
for (const f of files) {
  const before = fs.readFileSync(f, 'utf8');
  if (!/\bfx(Layout|Flex)/.test(before)) continue;
  if (f.endsWith('.ts') && !/template\s*:/.test(before)) continue;
  const after = before.replace(TAG_RE, (whole, tag, attrs, selfClose) => rewriteTag(whole, tag, attrs, selfClose, f));
  if (after !== before) {
    fs.writeFileSync(f, after);
    touched.push(f);
  }
}

console.log(`converted ${converted} attributes in ${touched.length} files`);
if (unmapped.length) {
  console.log('\nleft in place (convert by hand):');
  for (const u of unmapped) console.log(`  ${u.file}: ${u.attr} (${u.reason})`);
}
