const fs = require('fs');
const path = require('path');
const html = fs.readFileSync('/mnt/data/index_fall2026_mvp_v9_nav_json_1.html', 'utf8');
const start = html.indexOf('/* NAV-JSON-1 — Fall 2026 Chapter Workbook Import Standardization Patch');
const end = html.indexOf('function openChapterImportModal(){', start);
if (start < 0 || end < 0) throw new Error('Could not extract NAV-JSON-1 patch block');
let block = html.slice(start, end);
// provide browser/module stubs
const getChapterImports = () => [];
const window = {};
module.exports = {};
eval(block);
const validate = module.exports.validateChapterWorkbookFile || window.validateChapterWorkbookFile || validateChapterWorkbookFile;
function load(name){ return JSON.parse(fs.readFileSync(path.join('/mnt/data/nav_patch_pkg/nav_json_1_patch/test_fixtures', name), 'utf8')); }
const cases = [
  ['Chapter 2 existing-style export', 'chapter2_existing_style.json', true, '2'],
  ['Chapter 6 canonical v1.2 export', 'chapter6_canonical.json', true, '6'],
  ['Legacy guessed export', 'legacy_guessed.json', true, '6'],
  ['Malformed / not workbook JSON', 'malformed_not_workbook.json', false, null],
];
let out=[];
for (const [label, file, shouldPass, chapter] of cases){
  try{
    const result = validate(load(file), file);
    if(!shouldPass) throw new Error('Expected rejection but accepted');
    if(result.chapter !== chapter) throw new Error(`Expected chapter ${chapter} got ${result.chapter}`);
    if(!result.payload || typeof result.payload !== 'object') throw new Error('Missing normalized payload');
    if(!result.chapter_entry_key) throw new Error('Missing normalized entry key');
    if(!result.engagement_metadata || typeof result.engagement_metadata !== 'object') throw new Error('Missing engagement metadata');
    out.push(`PASS: ${label} — accepted chapter ${result.chapter}, schema ${result.schema_version}, key ${result.chapter_entry_key}`);
  } catch(e){
    if(shouldPass){
      out.push(`FAIL: ${label} — ${e.message}`);
      process.exitCode = 1;
    } else {
      out.push(`PASS: ${label} — rejected: ${e.message}`);
    }
  }
}
// extra legacy preservation assertion
const legacy = validate(load('legacy_guessed.json'), 'legacy_guessed.json');
if(!legacy.payload.chapter_specific || !legacy.payload.chapter_specific.legacy_unmapped_fields || legacy.payload.chapter_specific.legacy_unmapped_fields.summary !== 'Legacy summary.'){
  out.push('FAIL: legacy unmapped payload was not preserved under chapter_specific.legacy_unmapped_fields');
  process.exitCode = 1;
} else {
  out.push('PASS: Legacy unmapped payload preserved under chapter_specific.legacy_unmapped_fields');
}
if(!process.exitCode) out.push('\nNAV-JSON-1 patched Navigator test harness PASS');
console.log(out.join('\n'));
