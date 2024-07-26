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
