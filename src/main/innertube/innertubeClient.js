const crypto = require("node:crypto");
const { ORIGIN, API_URL, REFERER, USER_AGENT, WEB_REMIX } = require("./constants");

// ─── Utility ──────────────────────────────────────────────

function parseCookieString(cookie) {
  return Object.fromEntries(
    String(cookie || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return index === -1 ? [part, ""] : [part.slice(0, index), part.slice(index + 1)];
      })
  );
}

function authCookieValue(cookie) {
  const parsed = parseCookieString(cookie);
  return parsed.SAPISID || parsed["__Secure-3PAPISID"] || parsed["__Secure-1PAPISID"] || parsed.APISID || "";
}

function sha1(value) {
  return crypto.createHash("sha1").update(value).digest("hex");
}

// ─── Transport ────────────────────────────────────────────

class InnerTubeTransport {
  constructor(state = {}) {
    this.cookie = state.cookie || "";
    this.visitorData = state.visitorData || "";
    this.dataSyncId = state.dataSyncId || "";
    this.locale = { gl: "US", hl: "en" };
  }

  setAuth(state) {
    this.cookie = state.cookie || "";
    this.visitorData = state.visitorData || "";
    this.dataSyncId = state.dataSyncId || "";
  }

  /** Build InnerTube request context — mirrors Metrolist InnerTube.kt `ytClient()` body */
  context(includeLogin = false, client = WEB_REMIX) {
    return {
      client: {
        clientName: client.clientName,
        clientVersion: client.clientVersion,
        osName: client.osName || undefined,
        osVersion: client.osVersion || undefined,
        deviceMake: client.deviceMake || undefined,
        deviceModel: client.deviceModel || undefined,
        androidSdkVersion: client.androidSdkVersion || undefined,
        gl: this.locale.gl,
        hl: this.locale.hl,
        visitorData: this.visitorData || undefined
      },
      user: {
        onBehalfOfUser: includeLogin && client.loginSupported && this.dataSyncId ? this.dataSyncId : undefined
      }
    };
  }

  /** Build auth headers — mirrors Metrolist InnerTube.kt `ytClient()` headers */
  authHeaders(includeLogin, client = WEB_REMIX) {
    const headers = {
      "Accept": "application/json",
      "Accept-Language": "en-US,en;q=0.9",
      "Content-Type": "application/json",
      "Referer": REFERER,
      "Origin": ORIGIN,
      "User-Agent": client.userAgent || USER_AGENT,
      "X-Goog-Api-Format-Version": "1",
      "X-YouTube-Client-Name": client.clientId,
      "X-YouTube-Client-Version": client.clientVersion
    };

    if (includeLogin && client.loginSupported && this.cookie) {
      headers.Cookie = this.cookie;
      const sapisid = authCookieValue(this.cookie);
      if (sapisid) {
        const timestamp = Math.floor(Date.now() / 1000);
        headers.Authorization = `SAPISIDHASH ${timestamp}_${sha1(`${timestamp} ${sapisid} ${ORIGIN}`)}`;
      }
    }

    if (this.visitorData) headers["X-Goog-Visitor-Id"] = this.visitorData;
    return headers;
  }

  /**
   * Core HTTP POST to InnerTube endpoint — mirrors Metrolist `withRetry { httpClient.post(...) }`
   * Includes retry with exponential backoff for transient errors.
   */
  async request(endpoint, body = {}, options = {}) {
    const includeLogin = Boolean(options.login);
    const client = options.client || WEB_REMIX;
    const maxAttempts = options.maxAttempts || 3;
    const initialDelay = options.initialDelay || 500;

    let lastError;
    let currentDelay = initialDelay;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const url = endpoint.startsWith("http") ? endpoint : `${API_URL}/${endpoint}?prettyPrint=false`;
        const response = await fetch(url, {
          method: "POST",
          headers: this.authHeaders(includeLogin, client),
          body: JSON.stringify({
            context: this.context(includeLogin, client),
            ...body
          })
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`${endpoint} failed (${response.status}): ${text.slice(0, 600)}`);
        }
        return response.json();
      } catch (error) {
        lastError = error;
        // Only retry on network/transient errors, not on 4xx client errors
        if (error.message?.includes("(4") && !error.message?.includes("(429)")) throw error;
        if (attempt < maxAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          currentDelay = Math.round(currentDelay * 2);
        }
      }
    }
    throw lastError;
  }
}

module.exports = { InnerTubeTransport, parseCookieString, sha1 };
