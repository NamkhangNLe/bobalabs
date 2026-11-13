# Frontend review

## Design
The original rounded-card/gradient page is replaced by a people-first editorial network: warm paper, forest ink, Instrument Serif typography, staggered portrait composition, and a directly usable directory. Portraits and profiles are the existing repository content, not fabricated testimonials. Hero portraits filter the directory; search, specialty filters, result counts, reset states and LinkedIn profile links work. All profile data is shared with the full directory in one module.

## Checks
- `npm run build`
- `cd tests && npm ci && npx playwright install chromium && cd ..`
- `npm run test:e2e`

Four browser tests cover portrait discovery, search/filter/reset, full-directory navigation, mobile portrait proof and overflow, open/close mobile menu, and application navigation. No email is sent. For a locally installed Chrome, set `CHROME_PATH` to its executable.

The tests caught an existing mobile-menu stacking bug that prevented the toggle from closing the drawer. The PR fixes that and adds expanded state, inert closed navigation and Escape dismissal. Reduced-motion settings are respected.

## Honest limits
The directory is static, owner-maintained content. Existing candidate profile claims still need the owner's review. The application prepares a mailto email; its confirmation now explains that the visitor must send it. This does not add a referral/matching backend, prove endorsements or hiring outcomes, or certify YC readiness. Existing dependency audit findings are separate work.

## References
Viewed November 13, 2026: Linear (https://linear.app/), Resend (https://resend.com/) and PostHog (https://posthog.com/). Their useful common pattern is a distinctive visual identity plus product proof, not one generic SaaS template. No third-party assets or code were copied. Instrument Serif is loaded from Google Fonts with a Georgia fallback. Existing application tools/routes remain.
