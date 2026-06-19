NAV-JSON-1 Completed Patch Package

Patched Navigator HTML:
  index_fall2026_mvp_v9_nav_json_1.html

Test harness:
  test_patched_nav_json_1.cjs

Test results:
  nav_json_1_actual_test_results.txt

Fixtures tested:
  test_fixtures/chapter2_existing_style.json
  test_fixtures/chapter6_canonical.json
  test_fixtures/legacy_guessed.json
  test_fixtures/malformed_not_workbook.json

Summary:
  Adds Fall 2026 Chapter Workbook JSON standardization.
  Canonical recognition: ebb_export_type: "chapter_workbook".
  Canonical schema: EBB-Fall-2026-v1.2.
  Legacy compatibility: ebbChapterWorkbook: true.
  Normalizes payload buckets before preview/import.
