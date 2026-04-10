# Mobile Audit

Run a comprehensive mobile-first audit of the codebase. Search for non-responsive patterns and fix them.

## Check for these anti-patterns:
1. `p-8` or `p-6` without `sm:` prefix → should be `p-4 sm:p-8` or `p-4 sm:p-6`
2. `px-6` without `sm:` prefix → should be `px-4 sm:px-6`
3. `text-3xl` or larger without responsive scaling → should be `text-xl sm:text-3xl`
4. `grid-cols-2` or higher without `grid-cols-1` base → should be `grid-cols-1 sm:grid-cols-2`
5. Fixed widths like `w-64` that should be `w-full sm:w-64`
6. Touch targets smaller than 44px (py-1 on buttons)

## Process:
1. Use grep/ripgrep to find all violations across src/
2. Fix each one with proper mobile-first breakpoints
3. Run `npm run build` to verify no errors
4. Report what was changed

Skip files that already have proper responsive patterns. Do NOT double-fix (e.g., creating `sm:sm:p-8`).
