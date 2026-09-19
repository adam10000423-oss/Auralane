# Security Policy

## Supported versions

Security fixes are applied to the latest published Auralane release.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting feature in the **Security** tab of this repository. Include the affected version, reproduction steps, impact, and any suggested mitigation. Do not publish credentials, session cookies, private media-library data, or working exploits in a public issue.

## Local data

Auralane stores account sessions and application state locally. Session cookies are encrypted with Electron `safeStorage` when the operating system provides secure credential storage. If secure storage is unavailable, new session cookies are not persisted.
