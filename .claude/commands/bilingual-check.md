# Bilingual QA Check

Audit the codebase for bilingual (EN/FR) translation completeness.

## What to check:
1. Open `src/i18n/translations.ts` and verify every key in `en` also exists in `fr`
2. Search for hardcoded English strings in components (grep for common patterns like "Loading", "Save", "Cancel", "Delete", "Submit", "Search")
3. Verify all new pages/components use `const { t } = useLanguage()` and `t('key')` instead of hardcoded strings
4. Check that the `useLanguage()` hook is imported from `@/components/LanguageProvider`

## Process:
1. Compare EN and FR key counts — report any mismatches
2. List missing FR translations
3. Find hardcoded English strings that should use t()
4. Fix any issues found
5. Run `npm run build` to verify
