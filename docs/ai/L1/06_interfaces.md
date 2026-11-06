# 06 Interfaces

> Contracts at repo boundaries: API routes, env vars, runtime events, and shared TypeScript payloads.

## HTTP Route Contracts

### `GET /api/generate-agora-token`

Query params:

- `uid` optional; invalid/zero resolves to random RTM-safe UID.
- `channel` optional; defaults to generated `ai-conversation-<ts>-<rand>`.

Success response:

```json
{ "token": "...", "uid": "1234", "channel": "ai-conversation-..." }
```

Failure response: `{ "error": string, "details"?: string }` with `500`.

### `POST /api/invite-agent`

Body (`ClientStartRequest`):

```json
{ "requester_id": "1234", "channel_name": "ai-conversation-..." }
```

Success (`AgentResponse`):

```json
{ "agent_id": "...", "create_ts": 1710000000, "state": "RUNNING" }
```

Validation failures return `400`; server failures return `500`.

### `POST /api/stop-conversation`

Body (`StopConversationRequest`): `{ "agent_id": "..." }`.

Responses:

- `{ "success": true }`
- `{ "success": true, "state": "already-stopping" }` for idempotent stop state
- `{ "error": string }` on failure

### `POST /api/chat/completions`

Optional SSE proxy path (not default runtime path). Requires `NEXT_LLM_API_KEY` and `NEXT_LLM_URL` when used.

## Event/Data Interfaces

- RTM transcript/state/metrics/errors consumed through `AgoraVoiceAI` event emitter.
- Raw RTM `message` event parsed as fallback for `message.error` and `message.sal_status` payloads.
- `AGENT_METRICS` payloads displayed by `QuickstartPipelineMetrics`.

## Environment Contract

Required:

- `NEXT_PUBLIC_AGORA_APP_ID`
- `NEXT_AGORA_APP_CERTIFICATE`

This is the complete base `.env.local` contract. The optional BYOK route and provider snippets use additional variables only when a developer explicitly enables them.

## Test Coverage for Interfaces

- `scripts/verify-api-contracts.ts` asserts token generation, input validation, env failures, and SSE framing cases.

## Shared Client-Side Interfaces

From `types/conversation.ts` (high-use):

- `AgoraTokenData`: token bootstrap payload consumed by `LandingPage`.
- `AgoraRenewalTokens`: renewal callback result (`rtcToken`, `rtmToken`).
- `ConversationComponentProps`: runtime dependencies for in-call component.

## Interface Invariants

- Token payload must always include `token`, `uid`, `channel`.
- Invite route requires both `requester_id` and `channel_name`.
- Stop route requires `agent_id`; missing should never be tolerated silently.
- Token route should always return UID as string for downstream compatibility.

## Event Interface Notes

- Metrics stream entries are append-only in component state, capped to recent window.
- Connection issue records carry `source`, `agentUserId`, code/message, timestamp.
- SAL and signaling fallback payloads are parsed defensively because message schema can vary.

## Backward Compatibility Guidance

- If route response shape changes, update both client consumers and contract tests in same change.
- If adding fields, keep existing fields stable to avoid quickstart consumer breakage.
- Reflect interface changes in README and L1 docs to keep sample copyable.

## Related Deep Dives

- [conversation_lifecycle.md](L2/conversation_lifecycle.md) — How route contracts are used in sequence.
- [transcript_pipeline.md](L2/transcript_pipeline.md) — Event-level contract mapping.

Diwali TTS configuration: the invite route uses the native `SmallestAITTS` provider with `lightning_v3.1`, voice `harleen`, Hindi synthesis and number pronunciation, speed 1, and 24000 Hz audio. Set `SMALLEST_API_KEY` server-side in `.env.local` and deployment environments; it is required in addition to the two Agora credentials. Earlier base quickstart references to Agora-managed TTS or requiring only Agora keys do not apply to this Diwali configuration. STT and LLM remain Agora-managed. No standalone WAV route or UI change is needed.

Festival lookup: `GET /api/festival-info?city=Pune&year=2026&festival=lakshmi_puja` returns curated local data with source, verifiedOn and live=false, or available=false for missing coverage. This is not live Drik Panchang access. `AGENT_TOOL_BASE_URL` optionally registers this route as the native synchronous REST tool `lookup_festival_info`; it must be the public HTTPS origin of this app (deployment or tunnel). Without it, exact timings are unavailable to the agent. No extra data-provider key is required. Extend `lib/festival-info.ts` only with verified entries.
Call UI uses a central diya and state-based conversation cue; Hamari baatein toggles a compact transcript. Model names and pipeline metrics are not rendered.

Visual activities: the invite response includes `visual_token`, a one-hour HMAC capability bound to the RTC channel. `show_activity` POSTs `rangoli` or `puja` to `/api/activity?channel=...` with Bearer capability; the browser polls authenticated GET every 1.5 seconds and clears polling on unmount. `FestivalActivity` renders six local SVG design images or a Hindi household puja checklist and ordered guide with original source links. Buttons provide direct access without cloud tools. Requires AGENT_TOOL_BASE_URL for voice-triggered actions. Activity delivery currently uses a TTL-pruned process-local map: supported for a single local Next.js server, NOT reliable across multiple processes/serverless instances or restarts. Use a shared event store before deployment. Local art is illustrative, not photographs. The puja guide is a household outline, not every regional ritual or complete mantra text.
