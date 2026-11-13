# Boba Labs

A static referral directory with resume and cover-letter tools. Candidate text is owner-maintained, not a verified endorsement. Intake prepares an email for the visitor to send, not a backend submission.

## Run

Use Node 22 or newer. Run `npm ci`, then `npm run dev`. Open `/bobalabs/` on the local server. The Vite asset base and React Router basename both use `/bobalabs/`, matching the repository Pages path. A custom-domain root deployment would require changing both together.

## Browser checks

On a fresh machine run `npm run test:setup` once to install test dependencies and Chromium. Then run `npm run test:e2e`. If you use an existing Chrome installation instead, set `CHROME_PATH` to its executable path and skip the Chromium download. Linux may need Playwright's documented OS dependencies.

The tests build and serve the production output at `/bobalabs/`, not the Vite dev server. They cover portraits, real specialty filters, search, reset, mobile navigation and the intake route. They do not send email or verify candidate claims, external LinkedIn pages, resume PDF export or cover-letter generation.

No merge or deployment is performed by running these checks.
