# Build Feature

Build a new feature for Staybookt. Follow these steps:

## Before writing code:
1. Identify which files need changes (pages, components, store, API routes, types)
2. Check if similar patterns already exist in the codebase
3. Plan the mobile-first responsive approach

## While building:
1. Add TypeScript interfaces to `src/types/index.ts` if new data types are needed
2. Add bilingual strings to `src/i18n/translations.ts` (both EN and FR)
3. Use Zustand store for state (`src/store/index.ts`)
4. Follow existing component patterns (check similar pages for structure)
5. Use mobile-first Tailwind: base mobile styles, then sm:/md:/lg: for larger screens
6. Support dark mode using the isDark pattern from ThemeProvider

## After building:
1. Run `npm run build` — must pass with zero errors
2. Verify bilingual coverage (no hardcoded English strings)
3. Check responsive behavior mentally (would this work on a 375px screen?)

## User prompt:
$ARGUMENTS
