---
doc: prd
status: approved
language: en
translation_of: prd.md
---

# Hackathon Copilot — Product Requirements

English rendering of the [approved Russian PRD](prd.md), preserving its decisions and review additions. The original visual review is [prd.html](prd.html). This is one page for a participant managing their team's preparation for one hackathon, as defined in the scope.

## The Core Journey

1. First opening shows **Build your MVP** and the **EN / RU** switch.
2. Immediately below the heading is a short form: hackathon name, deadline, and **Start preparing**.
3. Creating the hackathon reveals the preparation workspace on the same page.
4. Manually add important updates with source links and tasks with assignees.
5. Mark completed tasks and see progress change.
6. Switch EN/RU at any time while preserving preparation data and text in open forms.
7. Reopen at the same address in the same browser profile and continue from the saved preparation and language.

## Screens and Layout

One page has an initial setup state and a workspace state. A compact EN/RU switch remains available in both. The setup form sits directly below the main heading. The workspace begins with the hackathon name, deadline, and prominent progress bar; tasks and assignees follow, then updates and useful links. Task fields are a title and optional assignee; update fields are a title and source link.

## Look and Feel

The user's references, including animation inspiration, are [Refero Styles](https://styles.refero.design/), [Skiper UI](https://skiper-ui.com/), and [AI SDK Agents](https://www.aisdkagents.com/). They establish a visual direction, not additional features or dependencies.

The user chose a dark background, light text, bright button/progress accents, and smooth motion. Specific palette, type, and motion details belong to the technical spec. Research in [design-research.md](design-research.md) reviewed these sites, two publicly available Refactoring UI chapters, and contrast/motion guidance; the spec carries the resulting implementation choices in English.

**Build your MVP** and the setup placement were user choices. **Start preparing** belongs to the selected setup option. The task labels **Task name**, **Assignee**, **Add task**, and **Unassigned** were proposed and accepted. The agent chose the simple update labels **News title**, **Link**, and **Add news**. All headings, labels, controls, empty states, and errors have English and Russian versions.

## Features and Behavior

### Hackathon Setup

Enter a required name and calendar deadline below the main heading and press **Start preparing**. The workspace then displays them at the top. **Edit hackathon** changes only those fields and preserves tasks and updates.

### Tasks and Assignees

Add tasks manually using **Task name**, optional free-text **Assignee**, and **Add task**. A task without an assignee shows **Unassigned**. A person can be assigned later. Completion and assignments persist with the rest of preparation. **Edit** changes the title or assignee; **Delete** removes the task. Editing preserves its completion state.

### News and Links

Manually save important hackathon updates below the tasks. Each contains a required **News title** and **Link**; no extra note field is included. Open a saved source link to read it. The user decides what work to add as a result; there is no automatic task link or news-to-task conversion. **Edit** changes the title/link and **Delete** removes the record. Automatic news fetching is deferred.

### Preparation Progress

A prominent progress bar appears beside the name and deadline. Completion marks change it immediately. Show a percentage and completed/total count, including 0% for an empty list; recalculate after adding, deleting, completing, or uncompleting a task. Only completing every current task produces 100%.

### Returning to Preparation

Save the hackathon, deadline, updates, tasks, assignees, completion marks, and chosen language between visits in the same browser profile and at the same address.

### Interface Language

EN/RU changes the entire interface on the same page. The Russian headline is the translation of **Build your MVP**, with matching setup and unassigned labels. User-entered hackathon/task titles, names, and update text retain their original wording. Original starter-plan titles follow the interface language, including previously saved tasks. Renamed tasks retain custom text. Preserve text in open forms and the current preparation state when switching. Remember a manual choice even before creating the first hackathon.

## States and Boundaries

First opening shows the heading and setup form. An existing hackathon shows its summary, tasks, and updates. Returning restores saved data and completion. Language switching changes labels and messages while preserving data and drafts. One operator manages preparation for the team on one computer. Empty lists and invalid input follow the defaults below.

## Proposed Defaults for Review

This stable heading preserves references from the original planning process. These simple defaults were agent proposals accepted with the complete visual PRD, distinct from decisions originally proposed by the user.

### Input and Corrections

- Require a hackathon name and a calendar date without a separate time.
- Require a task title; the assignee is optional.
- Require an update title and a usable web URL.
- Missing required text or an invalid link shows a clear adjacent hint. Do not add the record or clear the input.
- **Save changes** applies valid edits. **Cancel** closes editing and preserves the original record.

### Empty Lists and Progress

Show **No tasks yet** with an invitation to add a task and 0% progress. Show **No updates yet** with an invitation to add an important update manually. A task can be checked and unchecked; the bar, percentage, and count follow the current list in both directions.

### Saving and Returning

Persist changes between visits. If the browser cannot save them, show an understandable storage error while keeping already-entered data visible for the current visit.

### Initial Language

Use Russian when the browser's preferred language begins with `ru`, English otherwise. A saved manual EN/RU choice takes priority. This default was proposed by the agent and accepted with the PRD.

## Preparation Plan — Approved Review Addition

During final review, the user wanted more practical guidance and accepted a starter plan, next-step card, and day counter.

- Put two compact cards below the summary and above tasks: starter plan and next step.
- **Add starter plan** appends six ordinary tasks in the selected language: clarify the idea, build the MVP, test the app, prepare GitHub, record a demo, and submit. No additional service is needed.
- Preserve existing tasks, updates, assignments, and marks. Append missing steps without duplicates. Disable the button when all six exist. If a step is deleted, explicitly restore missing steps while preserving other edits and marks.
- The next step is the first unfinished task in list order. Original starter steps get a specific hint; custom or renamed tasks get a general hint. **Go to task** moves to the task's checkbox. Mutations immediately update this card.
- With no tasks, invite the user to add a plan or their own task. With all tasks complete, acknowledge the list and remind them to check requirements and actual submission. A completed list does not prove an entry has been submitted.
- Show calendar days using today's local date: days remaining, **Today**, or days past. Refresh while open and when returning; do not promise a countdown to the exact submission time.
- Translate original starter titles and hints across EN/RU while preserving custom or renamed text. Open an editor with the current displayed title; keep an already-open draft unchanged on language switching. This was clarified after the user reported Russian starter titles remaining in English mode.

## Product Decisions

The user chose the main heading, immediate setup form, summary/tasks/updates order, optional assignment now or later, both Edit and Delete, dark styling and motion, the three design references, and EN/RU. The user delegated the small update form's details to the agent, who selected title plus link. The complete visual PRD, including empty-state/error/date/language defaults, was approved. Further design research was requested and carried into the spec.

## What We're Building

One hackathon, manual updates, tasks and assignees, completion progress, EN/RU, persistence, and the approved preparation guidance, managed by one person on one page.

## Deferred From the POC

Automatic news, online collaborative editing, and automatic assignment remain future work.

## Non-Goals

Paid tools and services are excluded.

## Open Questions

No material functional questions remained at PRD approval. The stack, precise visual parameters, and research implementation were handled in `4-spec`.
