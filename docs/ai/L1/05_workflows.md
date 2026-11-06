# 05 Workflows

> Repeatable task recipes for common quickstart changes and validation loops.

## Run Locally

1. `pnpm install`
2. `agora login`
3. `agora project use <your-project>`
4. `agora project env write .env.local`
5. `pnpm run doctor`
6. `pnpm run dev`

If start fails, run `agora project doctor --deep`.

## Change Agent Behavior

Target file: `app/api/invite-agent/route.ts`.

Typical edits:

- System prompt (`ADA_PROMPT`).
- Greeting default (`GREETING`).
- Shared agent UID (`DEFAULT_AGENT_UID` in `lib/agora.ts`).
- VAD (`turnDetection.config.*`).
- STT/LLM/TTS model/provider blocks.

Validation path:

1. `pnpm run lint`
2. `pnpm run typecheck`
3. `pnpm run verify:api`
4. `pnpm run build`

## Change Token or Session Bootstrap

Token behavior:

- Edit `app/api/generate-agora-token/route.ts`.
- Preserve RTM-capable token generation.

Bootstrap behavior:

- Edit `components/LandingPage.tsx`.
- Keep invite + RTM setup parallelized before conversation mount.

## Change Transcript Rendering

1. Update transforms in `lib/conversation.ts`.
2. Update wiring in `components/ConversationComponent.tsx`.
3. Ensure `IN_PROGRESS` is separated from history, `INTERRUPTED` retained in history.
4. Re-check [transcript_pipeline.md](L2/transcript_pipeline.md) for consistency.

## Ship-Readiness Workflow

1. Run `pnpm run verify`.
2. Confirm docs alignment (`README`, guides, `AGENTS`, `docs/ai`).
3. Use conventional commit and branch naming.

## Progressive Disclosure Doc Workflow

- `generate docs`: create `docs/ai/` tree when absent.
- `update docs`: refresh after workflow/interface/security changes.
- `test docs`: execute question-based validation and write `docs/ai/test-results.md`.
- `fix docs`: close findings from `docs/ai/test-results.md` or a docs review.

## Workflow: Implement a Baseline Recipe Repo

1. Treat this repo as the official Agora Next.js quickstart baseline.
2. Do not recreate Agora ConvoAI integration from memory.
3. Follow [from_scratch_bootstrap.md](L2/from_scratch_bootstrap.md) for the implementation map and checklist.
4. Preserve the recipe invariants in `docs/ai/RECIPE.md`.
5. Run the verification commands before publishing a derivative.

## Workflow: Add a New API Route

1. Add route under `app/api/<route-name>/route.ts`.
2. Define payload types in `types/conversation.ts` if shared with client.
3. Add/update contract verification in `scripts/verify-api-contracts.ts`.
4. Run `pnpm run verify:api` and `pnpm run typecheck`.
5. Update `README.md` and `docs/ai/L1/06_interfaces.md`.

## Workflow: Modify Transcript UX

1. Update transforms in `lib/conversation.ts`.
2. Update render usage in transcript/layout components.
3. Validate edge states (`IN_PROGRESS`, `INTERRUPTED`, empty history).
4. Reconcile guidance in [transcript_pipeline.md](L2/transcript_pipeline.md).
5. Run `pnpm run lint` and `pnpm run build`.

## Workflow: Enable BYOK Provider Path

1. Uncomment relevant provider block in invite route.
2. Add the provider variables shown in the lower README BYOK section to your local environment.
3. Keep default no-key path intact for baseline quickstart behavior.
4. Keep provider variables out of `env.local.example`; they are not part of the base contract.
5. Re-run `pnpm run verify` before shipping.

## Workflow: Docs Refresh After Runtime Changes

1. Update L1 files matching changed subsystem.
2. Update or add L2 deep dives if L1 explanation exceeds concise bounds.
3. Bump `Last Reviewed` in `L0_repo_card.md`.
4. Re-run docs test and append retest notes for any fixes.

## Related Deep Dives

- [conversation_lifecycle.md](L2/conversation_lifecycle.md) — Full runtime sequence for bootstrap and teardown tasks.
- [from_scratch_bootstrap.md](L2/from_scratch_bootstrap.md) — Baseline implementation checklist for recipe consumers.
- [transcript_pipeline.md](L2/transcript_pipeline.md) — Required checks when editing transcript flow.

## Diwali agent behavior

The invite route configures Diwali Dost: short Hinglish replies, a festive greeting, rangoli and celebration help, and sourced 2026 Lakshmi Puja windows for Pune, Mumbai, New Delhi and Bengaluru. It asks for missing city/year and declines to invent other festival timings. Source: [Drik Panchang](https://www.drikpanchang.com/festivals/lakshmipuja/festivals-lakshmipuja-timings.html?geoname-id=1259229&year=2026), checked 6 November 2026. UI remains unchanged. TTS uses Smallest AI Harleen; Hindi recognition and pronunciation still need a live voice check.

Diwali TTS configuration: the invite route uses the native `SmallestAITTS` provider with `lightning_v3.1`, voice `harleen`, Hindi synthesis and number pronunciation, speed 1, and 24000 Hz audio. Set `SMALLEST_API_KEY` server-side in `.env.local` and deployment environments; it is required in addition to the two Agora credentials. Earlier base quickstart references to Agora-managed TTS or requiring only Agora keys do not apply to this Diwali configuration. STT and LLM remain Agora-managed. No standalone WAV route or UI change is needed.

Diwali UI: `DiwaliScene.tsx` supplies the illustrated SVG diya, rangoli, temple skyline and decorative lanterns. `QuickstartPreCallCard` uses animated heading lines, a start action and suggestion chips that preview what to ask aloud (they do not send messages). The call retains transcript, status, metrics and microphone controls with a state-driven diya. CSS motion respects reduced-motion preferences; the page scrolls on smaller screens.

Diwali speech recognition uses Agora `AresSTT` with festival hotwords. Set the primary interaction language through `turnDetection.language: hi-IN` (the SDK maps this to `asr.language`). No Deepgram key is required. Smallest AI TTS remains unchanged. Hindi-English code switching needs live validation. Reference: https://docs.agora.io/en/conversational-ai/models/asr/ares

Festival lookup: `GET /api/festival-info?city=Pune&year=2026&festival=lakshmi_puja` returns curated local data with source, verifiedOn and live=false, or available=false for missing coverage. This is not live Drik Panchang access. `AGENT_TOOL_BASE_URL` optionally registers this route as the native synchronous REST tool `lookup_festival_info`; it must be the public HTTPS origin of this app (deployment or tunnel). Without it, exact timings are unavailable to the agent. No extra data-provider key is required. Extend `lib/festival-info.ts` only with verified entries.
Call UI uses a central diya and state-based conversation cue; Hamari baatein toggles a compact transcript. Model names and pipeline metrics are not rendered.

Agent output is Hindi in Devanagari, including greeting and failure messages; captions display the same LLM text used for TTS. `lib/agent-date-context.ts` injects the server date/time in Asia/Kolkata at each session start. Ordinary current-date questions do not require the festival tool. This clock is a session-start snapshot, not a live clock. Restart existing conversations to pick up prompt/config changes.

Visual activities: the invite response includes `visual_token`, a one-hour HMAC capability bound to the RTC channel. `show_activity` POSTs `rangoli` or `puja` to `/api/activity?channel=...` with Bearer capability; the browser polls authenticated GET every 1.5 seconds and clears polling on unmount. `FestivalActivity` renders six local SVG design images or a Hindi household puja checklist and ordered guide with original source links. Buttons provide direct access without cloud tools. Requires AGENT_TOOL_BASE_URL for voice-triggered actions. Activity delivery currently uses a TTL-pruned process-local map: supported for a single local Next.js server, NOT reliable across multiple processes/serverless instances or restarts. Use a shared event store before deployment. Local art is illustrative, not photographs. The puja guide is a household outline, not every regional ritual or complete mantra text.

Visual opening also works locally from TRANSCRIPT_UPDATED: only the local user UID (including toolkit sentinel 0) is checked by `detectVisualIntent`; Hindi/Hinglish rangoli mentions dispatch a browser event, once per turn/activity. No public tool URL is needed for this local path. Cloud tools remain optional. The gallery fills the right half of the call with internal scrolling and externally hosted rangoli photographs linked to their source/credits (availability depends on third-party hosts). The transcript is hidden while a visual panel is open. Saffron lighting complements the navy/gold/ivory/coral palette.

Hindi persona: agent first-person stays feminine; the current male user is addressed with masculine second-person grammar. More-image requests (और तस्वीरें / show more) in rangoli context reveal the next four curated images, up to eight, with an explicit end-of-list state. Gallery opening preserves the live call and transcript on the left. The home illustration shrinks with viewport height so the start button stays visible at normal zoom.

Visual activity opening now uses the local transcript path plus direct buttons. The LLM no longer registers/calls show_activity or waits for visual content; puja/rangoli are local content and only exact timings use lookup_festival_info. The legacy activity endpoint remains for compatibility. Tabs expose aria-pressed and highlight the selected activity. Puja intent includes Roman vidhi/vidi and open/show variants.
