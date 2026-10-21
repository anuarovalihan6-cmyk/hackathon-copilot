---
doc: spec
status: approved
language: en
translation_of: spec.md
---

# Hackathon Copilot — Technical Spec

English technical version of the [approved Russian spec](spec.md). It preserves the approved implementation decisions and review additions. The original visual review is [spec.html](spec.html). The user approved the complete technical plan before `5-build`; current verification and shipping updates are identified separately below and in [checklist.en.md](checklist.en.md).

## How This Works, In Plain Language

HTML supplies the page's content, fields, and buttons. CSS controls its appearance and motion. JavaScript adds tasks, updates completion, calculates progress, and changes language. The user selected these three technologies. The agent creates files, implements code, runs available checks, and fixes errors; meaningful product choices are discussed in small steps.

The hackathon, tasks, updates, and language stay in browser `localStorage`. Reopening at the same address reads them back. Progress is derived from current tasks: one of two complete means 50%. A small Node.js file server serves the page locally; it does not store preparation data.

## The Core Journey Through the System

1. Load the page, read saved data, choose the saved language or browser-based default, and show setup or existing preparation.
2. Validate the required hackathon name and date, save the hackathon, and show the workspace.
3. Validate a task title and optional assignee, append it, refresh the list/count, and persist. Assignment can happen later.
4. Validate an update title and web URL, show it below tasks, and persist. Do not fetch the source content.
5. Completing, uncompleting, editing, or deleting records updates the model, derived progress, UI, and storage.
6. Switching EN/RU updates labels/messages and saves the preference while retaining user data and open drafts.
7. Reopening reads the same data and resumes preparation.

## Stack

The user chose HTML, CSS, and JavaScript during `4-spec`.

- [HTML](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content): one page and its forms.
- CSS: responsive layout, the chosen dark palette, and small animations.
- JavaScript browser modules: interactions, model rules, and rendering.
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage): browser persistence.
- Node.js 24.x with built-in [HTTP](https://nodejs.org/docs/latest-v24.x/api/http.html) and [test runner](https://nodejs.org/docs/latest-v24.x/api/test.html) modules: local serving and checks.

No framework, build step, third-party npm runtime dependency, database, or model API is needed. Git and Node.js were already available; no reinstall was necessary.

## Where It Runs and How Someone Tries It

In the repository root, run `npm start` (`node scripts/serve.cjs`) and open **http://127.0.0.1:4173/** in a normal modern Edge or Chrome window. Run checks with `npm test` (`node --test`). The implementation now includes these commands; they were planned before the build.

Use the same protocol, host, port, and browser profile. `localhost`, `127.0.0.1`, and other ports have separate storage. Closing the page does not clear records. Restart the local server before reopening. Directly opening the HTML file and an installed offline/PWA mode are outside this version.

The server binds only to `127.0.0.1:4173`. It allowlists the HTML, CSS, and five `src/` modules, excluding Git, private context, documents, and unrelated files. If the port is occupied, report the error rather than changing origin or terminating another process. App features make no external requests after loading; source links open only through user action. No keys or app accounts are needed.

The submission requires a public repository with source, instructions, and the planning documents plus a public working demo under three minutes. GitHub was selected. Live website hosting was not requested and is optional; a local recording demonstrates the core flow.

Planned demo: create a hackathon, save an update, add two tasks, assign a person, complete one to show 50%, switch language, reload, and show persistence. Use explicitly marked demo data; normal first use starts empty.

### Sharing Instructions — Current Status

- Public repository: https://github.com/anuarovalihan6-cmyk/hackathon-copilot, branch `main`.
- The user explicitly authorized publishing the code. The original publication retained history; anonymous GitHub API and browser checks verified public access, required files, and matching file hashes. Private learner context, credentials, and local screenshots of user data were excluded.
- Public two-minute demo: https://youtu.be/GnGB1JhI_1g. It shows hackathon setup, tasks and assignees, a manual update, 50% progress, EN/RU, reload persistence, and the starter plan. The file is 1920×1080 H.264/AAC with English technical captions and original quiet background music, without narration. Full video/audio decoding completed without errors and representative frames were inspected.
- YouTube confirmed public publication and no copyright issue in its preliminary check. Anonymous official oEmbed returned the video's metadata and embed HTML; browser playback confirmed 120 seconds with audio enabled.
- The GitHub/video links are saved in the existing Devpost draft and were checked after reopening. On October 22, 2026, the user approved MIT publication; [LICENSE](../LICENSE) is present on `main`. The draft's description, pitch, gallery, and license link are being completed. The entry has not been finally submitted, and no separate live website has been deployed.

## Look and Feel

Implements the PRD's chosen direction, with [Refero Styles](https://styles.refero.design/), [Skiper UI](https://skiper-ui.com/), and [AI SDK Agents](https://www.aisdkagents.com/) as references. The original research notes remain in [design-research.md](design-research.md); the concrete design decisions are recorded here in English. No third-party reference code is copied.

- Background `#101416`, panels `#171d20`, raised surfaces `#20282b`, primary text `#edf2ed`, secondary text `#a9b4b2`, lime accent `#cff56b` with dark text `#14190d`, error `#ffb4a7`, focus `#8fc4ff`, and functional input border `#667570`. Check actual color pairs against 4.5:1 for normal text and 3:1 for large text and required control indicators.
- System fonts with Cyrillic support (`system-ui`, `Segoe UI`, sans-serif), 16 px body text, 1.55 line height, and a responsive 32–48 px heading. No remote fonts.
- One primary column up to 980 px. Setup immediately follows the heading; workspace order is summary, guidance, tasks, then updates. Fields/actions wrap on narrow screens, long titles do not widen the page, and primary targets aim for about 44 px.
- Button transitions around 140 ms, new-row opacity/translation up to 4 px over 200 ms, and progress `scaleX` around 250 ms. Data changes immediately. Disable decorative transitions/movement under `prefers-reduced-motion: reduce`; no continuous animation.
- Persistent field labels, `aria-describedby` error associations, `aria-invalid`, short `aria-live="polite"` feedback, visible focus, and keyboard access. Text/state accompanies color.

## Components

These are logical parts of a small page, not separate libraries or services.

### Application Coordination

`src/main.js` connects handlers to model validation, rendering, and persistence. It reads storage on startup. Accepted actions update in-memory state, the screen, and storage. Progress is derived rather than saved separately.

### Hackathon Setup and Summary

`index.html`, `src/ui.js`, and `src/model.js` provide initial setup and the workspace summary. Require a trimmed name and valid calendar date. Store the date as `YYYY-MM-DD` without a time and display it without shifting the calendar day. Past dates are allowed. **Edit hackathon** changes name/date while retaining lists; **Save changes** validates and applies, **Cancel** preserves the old record.

### Task List and Editing

`ui.js` and `model.js` handle the task form, native checkboxes, and Edit/Delete. Reject a whitespace-only title. Store an empty assignee as `""` and render localized **Unassigned**. Editing keeps the completion mark. Cancel retains the original. All list/completion mutations recalculate progress.

### News List and Editing

Require a title and a URL with `http:` or `https:` plus a hostname. Invalid input remains available for correction. Sources open in a new tab with `rel="noopener noreferrer"`. No prefetching, automatic feed, or extra note field. Edit/Delete update only the intended record.

### Preparation Progress

A pure model function counts completed and total current tasks. Empty means 0%. Display `Math.floor(done * 100 / total)`, reaching 100% only when all current tasks are done. The bar reflects the actual fraction with an accessible progress value and visible percentage/count.

### Preparation Plan and Next Step

`model.js` describes six steps with stable IDs, localized title keys, and hint keys. Append only missing tasks with an empty assignee and `completed: false`; do not alter previous records. Stable IDs prevent duplicates even after edits and reopening. The schema and storage key remain version 1.

Derive the next task as the first unfinished task in list order. An original starter title gets its specific hint; a custom or renamed title gets a general hint. Empty/complete states omit the navigation button. **Go to task** scrolls and focuses its checkbox, respecting reduced motion.

The shared `taskDisplayTitle(task, language)` recognizes a starter by its stable ID and original EN/RU title. A manual task with identical words is still user text, and renamed starter text remains literal. Use this function for list titles, accessible action names, the next-step card, and the editor's initial value. Do not rewrite stored titles on display; old RU/EN records work without migration. Keep open drafts unchanged.

Calculate calendar differences using UTC midnights for the chosen date and today's local calendar date. Support years 0001–9999, today/past dates, month/year boundaries, leap years, and different time zones without treating the date as an exact submission timestamp. Refresh on render, return to the tab, and once per minute without disturbing drafts.

### Browser Storage

`src/storage.js` serializes one JSON record at `hackathon-copilot:v1` through `getItem`/`setItem`. Validate version, types, fields, dates, URLs, and unique IDs on read. Persist completed actions and language; closing the page need not preserve unfinished forms.

Missing data means first use. Access/write errors show localized feedback while retaining visible data in memory; a later mutation can retry. Corrupt or unknown-version storage must not be automatically overwritten: report the problem, continue in memory, and disable writing for the current visit. Never clear unrelated browser storage.

### Language, Forms and Feedback

`src/i18n.js` holds EN/RU headings, labels, controls, empty states, errors, and accessible names. Saved preference wins; otherwise browser language beginning with `ru` selects RU, all others EN. Save a manual preference even before hackathon setup.

`src/ui.js` changes labels/messages and document `lang` while keeping open-form values, edit modes, focus, and caret as needed. Keep drafts separate from saved records; reopening the same editor does not reset its draft. Different record drafts may coexist until Save/Cancel. Invalid input shows an adjacent hint without clearing the field. Render empty lists with invitations to add records. Insert user text through `textContent` and input values.

## Data Model

```text
{
  version: 1,
  language: "en" | "ru",
  hackathon: null | { name: string, deadline: "YYYY-MM-DD" },
  tasks: [{ id: string, title: string, assignee: string, completed: boolean }],
  news: [{ id: string, title: string, url: string }]
}
```

Create IDs on insertion and keep them on edit. Before hackathon creation lists are empty, but language can already be saved. Assignees are free text without separate member records. A single JSON snapshot is sufficient for one operator; conflicting edits across tabs are not coordinated.

Starter IDs are `starter-plan:idea`, `starter-plan:mvp`, `starter-plan:test`, `starter-plan:github`, `starter-plan:video`, and `starter-plan:submit`. Manual records receive UUIDs. Existing snapshots need no migration. Drafts, errors, focus, editor modes, and storage availability live separately in memory. Cancel discards the relevant draft; page closure may discard unfinished drafts.

## File Structure

```text
index.html                 one page, forms, lists, and messages
styles.css                 layout, colors, responsive rules, and motion
src/main.js                actions, rendering, and persistence coordination
src/model.js               validation, list operations, progress, and guidance
src/storage.js             JSON persistence and failure handling
src/i18n.js                English/Russian dictionaries
src/ui.js                  DOM rendering, drafts, focus, and messages
scripts/serve.cjs          allowlisted local file server
tests/model.test.js        validation and calculations
tests/preparation.test.js  tasks, updates, editing, and progress
tests/plan.test.js         starter plan, language, guidance, and dates
tests/storage.test.js      loading, persistence, and failure cases
tests/server.test.cjs      allowed files and private-path rejection
package.json              module mode and start/test commands
README.md                  English run, test, and storage instructions
.gitignore                private learning context and local credentials
skills-lock.json           installed official Skill Pack record
devpost/                   scope, PRD, spec, checklist, and visual reviews
```

The Skill Pack was installed before these application files were written. The private `devpost/learner-profile.md` is ignored and not published. English documentation counterparts supplement the approved Russian records.

## External Services and Dependencies

Runtime features use only browser capabilities. No external API, database, credentials, AI model call, paid service, or automatic news source is used. Node.js serves files and runs tests without storing preparation. The coding agent used AI during development. GitHub and video hosting belong to shipping, not runtime behavior.

## Important Failure Modes

- Missing text, invalid dates, or invalid URLs: localized field hints, no mutation, input retained.
- Storage unavailable, failing, corrupt, or unknown-version: follow the storage behavior above without false success or destructive overwrites.
- Port occupied: clear startup error, preserve the fixed origin, and resolve the conflict without killing unrelated processes.

## Verification Plan

This section preserves planned checks; outcomes are in the build record.

- Test date/URL boundaries, optional assignees, editing with completion preserved, progress after all mutations, empty 0%, and 100% only for complete lists.
- Test full snapshot/language round trips, first use, invalid JSON/schema/version, and simulated read/write exceptions without destroying existing or unrelated data.
- In-browser demo workflow plus Edit/Delete, Save/Cancel, errors, empty states, reload/reopen, and language preference before setup.
- Switch language during entry/editing and check drafts, focus, labels, and errors. Check long text, 320/390/768/1280 px widths, keyboard use, measured contrast, and reduced-motion CSS.
- Check local server allowlisting. Manual 200% zoom was planned but not confirmed by available browser automation; this is a limitation, not a full WCAG claim.
- For the review addition, test deduplication, explicit restoration, unchanged existing data, old/new starter-title translation, literal custom text, next-step states, focus, calendar boundaries, leap years, and time zones.

## What Was Simplified and Why

One hackathon, one operator, manually entered updates, free-text assignees, browser storage, and own CSS keep the proof of concept small. Shared editing, automatic news, and automatic assignment remain deferred. A public live deployment is optional; the repository and demo still provide judging access.

## Decisions and Open Issues

### Agreed Decisions

The user explicitly chose HTML/CSS/JavaScript, agreed to browser storage after its limits were explained, and approved the visual technical plan. They requested small steps and plain Russian explanations while delegating implementation, local setup, testing, and fixes to the agent.

### Learner Question: What Must I Install or Do Myself?

Git and Node.js were already checked. The agent handles available technical mechanics, explaining any necessary personal account action separately. The learner is not required to assemble code fragments themselves.

### Implementation Details Derived from These Decisions

The agent proposed the JSON snapshot, file modules, fixed local origin, precise palette, and CSS transitions; these were accepted with the complete plan rather than individually selected by the user. Storage is local to one origin/profile, not synchronized. Site-data clearing removes records; private browsing may discard them. A working server is needed to reopen the app.

### Open Issues

No material implementation question remained when the spec was approved. Live hosting was not selected. `5-build` recorded and completed the implementation order; shipping still requires the remaining personal survey answers and final user submission/eligibility confirmations.
