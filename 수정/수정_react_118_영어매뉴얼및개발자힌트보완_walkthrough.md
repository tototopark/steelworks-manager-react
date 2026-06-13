# Walkthrough - English User Manual & Developer Hints Verification

We have successfully drafted the full user manual for all 14 pages, verified all developer hints, corrected the workload capacity forecast API endpoints and hook mappings, and verified that the entire application builds without errors.

## Changes Made

1. **[NEW] [수정_react_118_사용자영문매뉴얼및개발자힌트보완.md](file:///f:/pe/public_html/steelworks-manager-react/수정/수정_react_118_사용자영문매뉴얼및개발자힌트보완.md)**
   - Created a comprehensive, unified-format English User Manual covering all 14 pages, detailing every button (including CRUD actions), access controls, and operational workflows.

2. **[MODIFY] [DevHints.js](file:///f:/pe/public_html/steelworks-manager-react/fe/src/components/common/DevHints.js)**
   - Audited the Developer Hints mapping and corrected `/dashboard/workload` references. Changed `/api/workload/forecast` to `/api/workload/plan`, and removed the non-existent `useWorkload.js` hook reference (API calls are processed directly within the page file). Expanded the database list to include `tb_punchsheet`, `tb_public_holidays`, and `tb_leaves` for accuracy.

3. **[MODIFY] [page.js (workload)](file:///f:/pe/public_html/steelworks-manager-react/fe/src/app/dashboard/workload/page.js)**
   - Updated the page-level custom-prop-driven `<DevHints>` parameters to align with the changes in `DevHints.js`.

## Validation Results

- Next.js production build (`npm run build`) completed successfully with 100% compilation and zero warnings.
