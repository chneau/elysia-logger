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
/*
```

## Changelog

### [1.0.2] - 2024-08-08

### Added

- Tests.

#### Fixed

- Properly log error requests.

### [1.0.1] - 2024-08-03

#### Fixed

- Package npm link.
