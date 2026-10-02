# elysia-logger

## Installation

```bash
bun install @chneau/elysia-logger
```

## Example

```ts
import { logger } from "@chneau/elysia-logger";
import { Elysia } from "elysia";

const app = new Elysia().use(logger()).listen(8080);
/*
<-- GET /logout
--> GET /logout 200 in 0 ms
<-- POST /login
--> POST /login 200 in 5 ms
*/
```

## Changelog

### [1.0.12] - 2026-10-02

#### Changed

- Generate type declarations with `tsc` directly, removing `bun-plugin-dts` and
  its TypeScript 5 override.

### [1.0.11] - 2026-10-02

#### Fixed

- Log the real response status for `status()`, `set.status`, not found, and
  thrown errors.

#### Added

- Tests covering the log format, method filtering, and status codes.

### [1.0.2] - 2024-08-08

### Added

- Tests.

#### Fixed

- Properly log error requests.

### [1.0.1] - 2024-08-03

#### Fixed

- Package npm link.
