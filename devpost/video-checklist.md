# Demo recording checklist

Technical shot list, not a narration script or submission description.

## Target

A roughly two-minute screen recording showing a complete preparation journey. Keep the final video below three minutes. Use English interface labels and English demonstration records. If narration or submitted text uses another language, provide an English translation.

Current sources: [Devpost rules](https://learn-ai-basics.devpost.com/rules), [Microsoft Snipping Tool instructions](https://support.microsoft.com/en-us/windows/apps/use-snipping-tool-to-capture-screenshots).

## Suggested shots

| Approximate position | What the screen shows | What to verify |
| --- | --- | --- |
| 0:00–0:20 | Create a demo hackathon with a name and deadline. | The overview shows its name, date and days remaining. |
| 0:20–1:10 | Save an update with its source link. Add two related preparation tasks and assign a demo teammate. | The source, tasks and assignee appear. The first version uses manual task creation. |
| 1:10–1:35 | Complete one of the two tasks. | Progress changes to 50%; the next-step card updates. |
| 1:35–2:00 | Switch EN/RU, return to EN and reload the page. | Interface labels change; records, assignee and completion survive the reload. |

The starter plan can be shown briefly if useful, but is not needed to prove this core journey. If adding its six tasks, the progress percentage will follow the new total rather than the two-task example above.

## Before recording

- Use a separate local demo origin with the same published application files, so existing preparation records are untouched. Start with empty demo lists and EN selected.
- Use clearly demonstrative names and records rather than private project data.
- Record the application area. Keep unrelated windows and login pages outside the recording area.
- Decide what to explain in your own words: who the app helps, what action is being shown, and what result changed. This checklist supplies technical shots only.

## Windows recording

On Windows 11, use Microsoft Snipping Tool for screen recording.

1. Open the demo page in the browser and select EN.
2. Press **Win + Shift + R** to open video capture.
3. Select the application area and choose **Start**. If using narration, check the microphone setting before starting.
4. Perform the shots, then choose **Stop** and save the recording. Suggested filename: `hackathon-copilot-demo.mp4`.

Operate the recording controls on the computer being captured, then review the saved file.

## After recording

- Review the whole file: readable application text, complete journey, final duration below three minutes, and required English content or translation.
- Upload the final video to YouTube or Vimeo and make it publicly visible as required by the rules. Check the final link without signing in.
- Add the real video URL to `spec.md > Sharing Instructions` and mark only completed steps in `checklist.md`.
- The MP4 has been produced, checked and published on YouTube; its URL has been saved in the Devpost draft.

## Recorded result — 22 October 2026

`Hackathon-Copilot-demo.mp4` is saved in this task's local outputs, outside the source repository. It is exactly 120 seconds, 1920×1080, H.264 at 30 output frames per second, with AAC stereo audio. Seven actual application clips were captured through the supported browser screenshot API, at approximately eight samples per second, then edited with fades and technical English labels. The quiet instrumental music is procedurally composed without external samples; there is no narration.

| Final time | Recorded action |
| --- | --- |
| 0:00–0:06 | Project title and interface feature labels. |
| 0:06–0:21 | Create the hackathon and deadline. |
| 0:21–0:43 | Add two tasks, assigned to Alex and Jordan. |
| 0:43–0:57 | Save a manually entered update and its official source link. |
| 0:57–1:11 | Complete one task and show 50% progress. |
| 1:11–1:23 | Switch EN → RU → EN. |
| 1:23–1:37 | Reload and show the retained task records and completion. |
| 1:37–1:52 | Add the six starter tasks to the existing two. |
| 1:52–2:00 | Project name, repository URL and technical stack. |

All 3,600 output video frames and the audio decoded successfully. Representative scenes and an extracted final-video frame were visually inspected. The separate demo origin kept the user's main preparation records untouched. Application source code was not modified for recording.

## Published result

- Public video: [Hackathon Copilot](https://youtu.be/GnGB1JhI_1g).
- The user authorized the upload, accepted the YouTube terms and separately confirmed the audience setting. Public visibility was selected, and YouTube displayed its publication confirmation.
- YouTube's preliminary copyright check reported no issues. The uploaded file contains the quiet original instrumental music and no voiceover.
- An anonymous request to YouTube's public oEmbed API returned the correct title, channel and embed HTML. Browser playback was verified with the player at 57 seconds, 120 seconds total, audio unmuted and media ready. The web fetch service initially returned a cache miss; the official oEmbed endpoint and browser verification succeeded.
- The video URL and repository URL were saved in the existing Devpost draft. Reopening Project details confirmed both persisted values. The learner's name, description and personal answers were not rewritten.
- The entry remains a draft. Remaining form text, personal responses, required license URL and final submission are separate unfinished work.
