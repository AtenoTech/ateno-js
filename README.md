# Ateno JavaScript SDK (`ateno-js`)

Official JavaScript SDK for the Ateno API, including a lightweight CLI entrypoint.

## Overview

This package provides:

- A JavaScript SDK (`Ateno`, `AtenoClient`, `Users`) for API access.
- A CLI command (`ateno-js`) exposed via the package `bin` field.
- Homebrew distribution support through the `AtenoTech/ateno-homebrew` tap.

Current version source of truth: `package.json`.

## Install

### NPM

```bash
npm install @atenotech/ateno
```

### Homebrew

```bash
brew tap AtenoTech/ateno-homebrew
brew install ateno-js
```

## Quick Start

```js
import { AtenoClient } from "@atenotech/ateno";

const client = new AtenoClient({ apiKey: process.env.ATENO_API_KEY });

const me = await client.request("/user");
console.log(me);
```

### Using the `Users` helper

```js
import Ateno from "@atenotech/ateno";

const ateno = new Ateno(process.env.ATENO_API_KEY);

const currentUser = await ateno.users.getUser();
const specificUser = await ateno.users.getUserById("user_123");
```

## API Reference

### `new AtenoClient(apiKeyOrConfig, options?)`

- Accepts either a string API key: `new AtenoClient("key")`.
- Accepts a config object: `new AtenoClient({ apiKey, baseURL })`.
- Defaults `baseURL` to `https://api.ateno.tech`.

### `client.request(path, options?)`

- Sends JSON requests to `baseURL + path`.
- Supports `method` (default: `GET`).
- Supports `body` (object, JSON-encoded).
- Automatically includes `Content-Type: application/json`.
- Automatically includes `Authorization: Bearer <apiKey>`.
- Throws an `Error` when the response is not OK.

### `new Ateno(apiKey, options?)`

- Convenience wrapper exposing `ateno.client` and `ateno.users`.

### `Users`

- `getUser()` -> `GET /user`
- `getUserById(id)` -> `GET /users/:id`

## CLI

The package installs the `ateno-js` command.

```bash
ateno-js --version
```

Current behavior prints the CLI version string.

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
npm run build
```

Build output is written to `dist/` by `build.js`.

### Validate local CLI

```bash
node ./bin/index.js --version
```

## Contributor Workflow

### Branch and commit conventions

- Use focused branches per change.
- Prefer Conventional Commit style such as `feat: ...`, `fix: ...`, `docs: ...`, and `chore: ...`.

### Change checklist

- Update code in `src/` and/or `bin/`.
- Run `npm run build` and sanity check outputs.
- Update docs when behavior changes.
- Ensure `package.json` version is updated for releases.

## Release Process

Do not manually compute Homebrew checksums in normal flow. Release automation should update formula metadata.

1. Bump `version` in `package.json`.
2. Commit and push to `main`.
3. Tag the same version with `v` prefix.

```bash
git add .
git commit -m "release: v0.1.x"
git push origin main
git tag v0.1.x
git push origin v0.1.x
```

4. Verify CI completed in GitHub Actions.
5. Confirm install path:

```bash
brew update
brew upgrade ateno-js || brew install ateno-js
ateno-js --version
```

## Homebrew Notes

- Formula lives in `ateno-homebrew/Formula/ateno-js.rb`.
- Formula installs with npm and links binaries from package `bin` definitions.

## Troubleshooting

### Homebrew reinstall/reset

```bash
brew update
brew uninstall --force ateno-js
rm -rf /opt/homebrew/Cellar/ateno-js
brew install ateno-js
```

### Command not found after install

- Run `brew doctor` and confirm Homebrew prefix is in your shell `PATH`.
- Confirm binary exists: `ls -la /opt/homebrew/bin/ateno-js`

## License

MIT


