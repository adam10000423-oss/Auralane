# Public Listen Together Relay

This service synchronizes room metadata, queue entries and playback clocks. It
does not proxy music, collect YouTube credentials or distribute audio files.

## Render Setup

The server files must be committed and pushed to the selected GitHub branch
before deploying. Local files are not visible to Render. This setup does not
publish a desktop release or enable the service in already-installed EXEs.

Create a **Web Service**, not a Static Site or Private Service.

| Field | Value |
| --- | --- |
| Repository | Auralane |
| Branch | The branch containing these server files |
| Name | auralane-together (or an available name) |
| Runtime | Node |
| Root Directory | Leave empty |
| Build Command | `npm ci --prefix server/listen-together --omit=dev` |
| Start Command | `node server/listen-together/server.js` |
| Instance Type | Free for initial testing |
| Health Check Path | `/health` |

Environment variables:

```text
NODE_VERSION=22
NODE_ENV=production
TRUST_PROXY=1
```

`TRUST_PROXY=1` is only for deployment behind Render's reverse proxy. Leave it
unset when exposing the Node server directly. Optionally set `PUBLIC_ORIGIN` to
the exact assigned HTTPS origin to also enforce the incoming Host header.

The repository-root `render.yaml` is an alternative Blueprint configuration
containing the same settings. No database, disk or background worker is needed.

## Validate Before Packaging

1. Wait for Render to report the service is live.
2. Open `https://YOUR-SERVICE.onrender.com/health` and verify JSON containing
   `"ok": true` and `"protocol": 1`.
3. Test create/join/play/pause/seek on two computers using different networks.
4. Only after verification, put the real origin into
   `src/config/online-together.json` under `serverUrl` and build the new EXE.

Do not use an example domain or localhost as a released default. The bundled URL
is public configuration, not a password. Room membership tokens stay in the
Electron main process and are never stored in the renderer or invitation URLs.

## Operational Limits

- Single service instance. Room state is in memory, not shared across replicas.
- Eight members per room, 200 tracks per queue, 100 concurrent rooms by default.
- Only the host can change playback and queue state. Guests can leave freely.
- Host departure closes the room; a disconnected host has 60 seconds to return.
- All rooms expire after 12 hours. Restarting or redeploying closes all rooms.
- Creation, joining, messages and HTTP calls are rate limited. Request, message
  and outgoing-buffer sizes are bounded. These controls are not a DDoS guarantee.
- HTTPS/WSS is required outside explicitly local development tests.
- The free Render tier can sleep after 15 minutes of inactivity. A cold start
  can take about one minute. Free quotas also apply; this is an initial testing
  deployment, not a promise of an always-available production service.

Official references: [WebSockets](https://render.com/docs/websocket),
[free tier](https://render.com/docs/free),
[Node deployment](https://render.com/docs/deploy-node-express-app).

## Local Verification

```sh
npm run test:online
```

The tests start an ephemeral server and use two independent main-process clients
to verify room creation, joining, queue/playback sync, permissions and cleanup.
These are local protocol tests, not proof that a public deployment is live.
