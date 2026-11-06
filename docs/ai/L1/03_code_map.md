# 03 Code Map

> Directory-level ownership map and where to change behavior safely.

## Top-Level Layout

```text
app/                 Next.js routes + API handlers
components/          Client UI and RTC/RTM lifecycle
lib/                 Shared helpers and server-side chat completions handler
scripts/             Verification and doctor helpers
docs/                Human-oriented guides
docs/ai/             Progressive disclosure docs (this system)
public/              Static assets and branding
types/               Shared TypeScript route/component contracts
```

## API Route Ownership (`app/api`)

- `generate-agora-token/route.ts`: builds RTC+RTM token via `buildTokenWithRtm`.
- `invite-agent/route.ts`: validates input/env, configures and starts agent session.
- `stop-conversation/route.ts`: stops agent and handles idempotent already-stopping cases.
- `chat/completions/route.ts`: optional OpenAI-compatible SSE proxy for custom LLM path.

## Client Ownership (`components`)

- `LandingPage.tsx`: pre-call shell, token/invite/RTM bootstrap, conversation mount/unmount.
- `ConversationComponent.tsx`: RTC join, mic publish, toolkit init, transcript/metrics/issues state.
- `QuickstartConversationLayout.tsx`: in-call framing and slots.
- `QuickstartTranscriptPanel.tsx`: live transcript panel.
- `QuickstartPipelineMetrics.tsx`: latency chips from metrics stream.
- `ConnectionStatusPanel.tsx` + `ConversationErrorCard.tsx`: issue rendering/severity.

## Shared Logic (`lib`)

- `chat-completions.ts`: server-side custom LLM SSE handler factory, shared by the route and contract tests.
- `agora.ts`: default constants (`DEFAULT_AGENT_UID`).
- `conversation.ts`: transcript normalization, spacing cleanup, timestamp normalization, visualizer state mapping.

## Validation and Tooling

- `scripts/verify-api-contracts.ts`: imports route handlers and validates contract behavior.
- `scripts/doctor.mjs`: local setup checks consumed by `pnpm run doctor`.
- `tailwind.config.ts`: includes `agora-agent-uikit` dist classes in content scan.

## Fast File Lookup

- Change agent prompt/model/VAD -> `app/api/invite-agent/route.ts`.
- Change token policy/channel naming -> `app/api/generate-agora-token/route.ts`.
- Change transcript mapping behavior -> `lib/conversation.ts` + `components/ConversationComponent.tsx`.
- Change session bootstrap UX -> `components/LandingPage.tsx`.

## Additional Component Roles

- `QuickstartPreCallCard.tsx`: start CTA and pre-call messaging.
- `QuickstartConversationLayout.tsx`: shared in-call composition shell.
- `MicrophoneSelector.tsx`: input-device selection UI.
- `ConnectionStatusPanel.tsx`: summary + detailed connection issue panel.
- `ErrorBoundary.tsx`: runtime guardrail for conversation subtree.

## Type Contract Locations

- `types/conversation.ts`: request/response payloads and component prop types.
- `types/env.d.ts`: typed environment variable expectations.
- `types/jsx.d.ts` and `react-jsx.d.ts`: JSX typing support details.

## Static and Styling Assets

- `public/*`: icons, logos, and heading SVG assets used in pre-call/in-call experience.
- `app/globals.css` and `styles/globals.css`: baseline theme/layout styles.
- `tailwind.config.ts`: utility class scan and theme extension.

## Verification Path Mapping

- API contract behavior test: `scripts/verify-api-contracts.ts`.
- Environment and prerequisites check: `scripts/doctor.mjs`.
- Aggregate check chain: `pnpm run verify` script in `package.json`.

## Ownership Boundaries

- `components/` owns client runtime lifecycle and UI state.
- `app/api/` owns privileged operations needing app certificate.
- `lib/` owns reusable helpers; `chat-completions.ts` is server-side only.
- `docs/` owns human-facing implementation narrative and runbooks.

## Related Deep Dives

- [conversation_lifecycle.md](L2/conversation_lifecycle.md) — Cross-file call path during start/stop.
- [from_scratch_bootstrap.md](L2/from_scratch_bootstrap.md) — Official baseline map for recreating the quickstart recipe.
- [transcript_pipeline.md](L2/transcript_pipeline.md) — Mapping and rendering flow from toolkit events.

Diwali UI: `DiwaliScene.tsx` supplies the illustrated SVG diya, rangoli, temple skyline and decorative lanterns. `QuickstartPreCallCard` uses animated heading lines, a start action and suggestion chips that preview what to ask aloud (they do not send messages). The call retains transcript, status, metrics and microphone controls with a state-driven diya. CSS motion respects reduced-motion preferences; the page scrolls on smaller screens.

Festival lookup: `GET /api/festival-info?city=Pune&year=2026&festival=lakshmi_puja` returns curated local data with source, verifiedOn and live=false, or available=false for missing coverage. This is not live Drik Panchang access. `AGENT_TOOL_BASE_URL` optionally registers this route as the native synchronous REST tool `lookup_festival_info`; it must be the public HTTPS origin of this app (deployment or tunnel). Without it, exact timings are unavailable to the agent. No extra data-provider key is required. Extend `lib/festival-info.ts` only with verified entries.
Call UI uses a central diya and state-based conversation cue; Hamari baatein toggles a compact transcript. Model names and pipeline metrics are not rendered.

Festival visual theme: Deep navy #172A38, Solar gold #E8B654, Warm ivory #F6F2E9, Mars coral #D75D45. `DiwaliBanderwal` in `DiwaliScene.tsx` renders the decorative top garland; navigation spacing keeps it clear of controls. Palette applies to illustrations, gallery and conversation panels.

The viewport is fixed with no document scrolling. Visual activities open in an independently scrollable right panel (overlay on narrow screens); transcript remains a separate panel. Rangoli mentions instruct the agent to call show_activity. Existing cloud-tool public HTTPS and single-process delivery requirements still apply.

Visual opening also works locally from TRANSCRIPT_UPDATED: only the local user UID (including toolkit sentinel 0) is checked by `detectVisualIntent`; Hindi/Hinglish rangoli mentions dispatch a browser event, once per turn/activity. No public tool URL is needed for this local path. Cloud tools remain optional. The gallery fills the right half of the call with internal scrolling and externally hosted rangoli photographs linked to their source/credits (availability depends on third-party hosts). The transcript is hidden while a visual panel is open. Saffron lighting complements the navy/gold/ivory/coral palette.
