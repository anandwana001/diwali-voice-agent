# 02 Architecture

> Runtime architecture for browser RTC/RTM, Next.js route handlers, and Agora managed agent session.

## High-Level Shape

- Next.js App Router frontend and API routes in one deployable app.
- Browser joins Agora RTC channel and uses RTM for transcript/state/metrics/errors.
- Server-side routes mint token and call Agora Agent Server SDK.
- Agent executes STT -> LLM -> TTS pipeline in Agora cloud.

## Component Graph

```text
Browser UI (LandingPage + ConversationComponent)
  -> GET /api/generate-agora-token
  -> POST /api/invite-agent
  -> RTC join/publish mic
  -> RTM subscribe + AgoraVoiceAI events
  -> POST /api/stop-conversation

Next.js API routes
  -> agora-token (RtcTokenBuilder.buildTokenWithRtm)
  -> agora-agents (start/stop managed agent)

Agora Cloud
  -> Agent session (Agora ARES STT + OpenAI LLM + Smallest AI Harleen TTS)
  -> RTM payloads (transcript, state, metrics, error)
```

## Start Sequence

1. UI fetches RTC+RTM token and channel.
2. UI invites agent and initializes RTM in parallel.
3. UI mounts conversation view.
4. `useJoin` connects RTC once `isReady` guard passes.
5. `AgoraVoiceAI.init()` subscribes transcript/state/metrics streams.

## End Sequence

1. UI calls `/api/stop-conversation` with `agent_id` if present.
2. UI logs out RTM client.
3. RTC hook ownership handles leave/unpublish cleanup.
4. Component state resets to pre-call shell.

## Core State Domains

- Session bootstrap: `LandingPage` (`agoraData`, `rtmClient`, loading/error flags).
- RTC transport and mic: `ConversationComponent` + `agora-rtc-react` hooks.
- Transcript + agent state: `AgoraVoiceAI` events mapped through `lib/conversation.ts`.
- Metrics and connection issues: `AGENT_METRICS`, `MESSAGE_ERROR`, `SAL_STATUS`, RTM fallback parsing.

## External Dependencies

- `agora-rtc-react` / `agora-rtc-sdk-ng` for media transport.
- `agora-rtm` for data channel.
- `agora-agent-client-toolkit` and `agora-agent-uikit` for conversation logic/UI.
- `agora-agents` for managed agent lifecycle.

## Deployment Modes

- Local development via `pnpm run dev`.
- Vercel deployment as single Next.js app with server env vars.

## Data and Control Boundaries

- Browser never sees the app certificate; only receives signed short-lived tokens.
- Agent lifecycle control (`start`, `stop`) is server-routed.
- Transcript/state/metrics are data-plane RTM events from agent to browser.
- UI control-plane actions (start/end, renew) originate in `LandingPage`.

## Internal Interfaces Between Components

`LandingPage` -> `ConversationComponent` props:

- `agoraData` (`token`, `uid`, `channel`, optional `agentId`)
- `rtmClient` (already logged-in and subscribed)
- `onTokenWillExpire(uid)` callback for dual-token renewal
- `onEndConversation()` callback for teardown and route stop call

`ConversationComponent` -> child UI components:

- normalized transcript items and current in-progress turn
- agent visualizer state derived from transport + semantic state
- connection issue list and derived severity
- recent metric window for stage latency chips

## Why the App Router Structure Matters

- API handlers under `app/api` co-deploy with UI and share env management.
- Client components isolate browser-only SDK usage via dynamic import and `ssr: false`.
- This avoids SSR-side access to WebRTC-dependent modules.

## Change Impact Hints

- Changes to token or invite routes affect both startup and renewal paths.
- Changes to transcript mapping can break both transcript panel and visualizer semantics.
- Changes to RTM setup in `LandingPage` affect toolkit subscription readiness.

## Related Deep Dives

- [conversation_lifecycle.md](L2/conversation_lifecycle.md) — Detailed bootstrapping and teardown timeline.
- [transcript_pipeline.md](L2/transcript_pipeline.md) — Event mapping, UID remap, in-progress/completed segmentation.

Diwali TTS configuration: the invite route uses the native `SmallestAITTS` provider with `lightning_v3.1`, voice `harleen`, Hindi synthesis and number pronunciation, speed 1, and 24000 Hz audio. Set `SMALLEST_API_KEY` server-side in `.env.local` and deployment environments; it is required in addition to the two Agora credentials. Earlier base quickstart references to Agora-managed TTS or requiring only Agora keys do not apply to this Diwali configuration. STT and LLM remain Agora-managed. No standalone WAV route or UI change is needed.

Diwali speech recognition uses Agora `AresSTT` with festival hotwords. Set the primary interaction language through `turnDetection.language: hi-IN` (the SDK maps this to `asr.language`). No Deepgram key is required. Smallest AI TTS remains unchanged. Hindi-English code switching needs live validation. Reference: https://docs.agora.io/en/conversational-ai/models/asr/ares

Visual activities: the invite response includes `visual_token`, a one-hour HMAC capability bound to the RTC channel. `show_activity` POSTs `rangoli` or `puja` to `/api/activity?channel=...` with Bearer capability; the browser polls authenticated GET every 1.5 seconds and clears polling on unmount. `FestivalActivity` renders six local SVG design images or a Hindi household puja checklist and ordered guide with original source links. Buttons provide direct access without cloud tools. Requires AGENT_TOOL_BASE_URL for voice-triggered actions. Activity delivery currently uses a TTL-pruned process-local map: supported for a single local Next.js server, NOT reliable across multiple processes/serverless instances or restarts. Use a shared event store before deployment. Local art is illustrative, not photographs. The puja guide is a household outline, not every regional ritual or complete mantra text.
