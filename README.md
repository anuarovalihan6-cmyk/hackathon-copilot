# Hackathon Copilot

A small hackathon preparation workspace built with the official Devpost Learn Skill Pack. [Русская инструкция](README.ru.md).

Public repository: [anuarovalihan6-cmyk/hackathon-copilot](https://github.com/anuarovalihan6-cmyk/hackathon-copilot), branch `main`.

Two-minute working demo: [YouTube](https://youtu.be/GnGB1JhI_1g).

License: [MIT](LICENSE), Copyright (c) 2026 alikhan.

## What works

Create and edit one hackathon with a name and deadline. Add tasks with optional assignees, mark them complete, and see progress update. Save important updates manually with source links. Tasks and updates support editing, deletion, and save/cancel. English/Russian UI and saved preparation persist in browser storage.

**Add starter plan** appends six tasks from idea to submission without replacing existing records or making duplicates. Missing steps can be explicitly restored. Original starter titles follow EN/RU, including older saved tasks; custom and renamed text stays unchanged. **Next step** points to the first unfinished task. The deadline counter uses local calendar days, not an exact submission-time countdown.

## Run locally

Use Node.js 24.x (tested with 24.17.0). There are no third-party npm dependencies; `npm install` is unnecessary.

Clone or download the repository, open a terminal in its root directory, and run:

```sh
npm start
```

Open **http://127.0.0.1:4173/** in a normal browser window. The server listens on loopback only. Stop it with Ctrl+C in its terminal.

Keep the same address and browser profile: storage belongs to the protocol, host, and port. Saved data remains when the server stops, but restart it to open the app again. Opening `index.html` directly is unsupported.

## Try the core workflow

1. Choose EN or RU, enter a hackathon name and deadline, and start preparing.
2. Add an update with an HTTP/HTTPS source link, then add two tasks and optionally assign a person.
3. Complete one task: the overview shows 50% and one of two complete.
4. Try editing a task or update, then switch language and reload at the same address.
5. Add the starter plan to see the six preparation steps and next-step guidance.

## Storage and limits

Data stays in `localStorage` under `hackathon-copilot:v1`. Clearing site data removes records. There is no device sync, live collaboration, automatic news feed, automatic assignment, backend, or AI chat inside the application. AI assisted development through a coding agent. Private browsing does not guarantee persistence after closing. Storage failures display a warning while keeping current data visible; corrupt or unknown-version data is not automatically overwritten. Unsaved form drafts may be lost on closing.

## Checks

```sh
npm test
```

The built-in Node.js runner passed 28 tests covering dates, schema validation, tasks, updates, editing, progress, starter-plan behavior, persistence, language handling, storage errors, and the local server's file allowlist. Browser checks covered the core workflow, EN/RU, drafts, persistence, keyboard use, and widths from 320 to 1280 px. Browser zoom at 200% was not confirmed; full WCAG conformance is not claimed. See the [English build record](devpost/checklist.en.md) and [original checklist](devpost/checklist.md).

## Planning documents

- [English scope](devpost/scope.en.md) / [original scope.md](devpost/scope.md): the proof-of-concept boundary.
- [English PRD](devpost/prd.en.md) / [original prd.md](devpost/prd.md): agreed product behavior.
- [English technical spec](devpost/spec.en.md) / [original spec.md](devpost/spec.md): architecture, data, and verification plan.
- [English build record and code map](devpost/checklist.en.md): implementation, review, and checks.
- [Design research](devpost/design-research.md) and [visual code map](devpost/app-map.html): original Russian reference material. English design decisions and code paths are covered in the spec and build record above.

The Skill Pack was installed before application code; the scope, PRD, and spec were approved before implementation. Their English counterparts preserve those decisions. The private learner profile and local `.env` files are excluded from Git. The code and video are public. On October 22, 2026, Devpost confirmed **Project submitted!** for Build With AI: Basics. [Project page](https://devpost.com/software/hackathoncopilot).
