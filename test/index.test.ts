import { expect, spyOn, test } from "bun:test";
import Elysia, { status } from "elysia";
import { logger } from "../src";

const spy = spyOn(console, "log");

// onAfterResponse runs after the response is handed back to the client.
const settle = () => new Promise((resolve) => setTimeout(resolve, 20));

test("logs request and response for a normal case", async () => {
	const server = new Elysia()
		.use(logger())
		.get("/", () => "Hello, World!")
		.listen(3000);

	spy.mockClear();
	const response = await fetch("http://localhost:3000");
	await settle();

	expect(response.status).toBe(200);
	expect(spy).toHaveBeenCalledTimes(2);
	expect(spy).toHaveBeenCalledWith("<--", "GET", "/");
	expect(spy).toHaveBeenCalledWith(
		"-->",
		"GET",
		"/",
		200,
		"in",
		expect.any(Number),
		"ms",
	);
	await server.stop();
});

test("logs the request line before the response line", async () => {
	const server = new Elysia()
		.use(logger())
		.get("/", () => "ok")
		.listen(3001);

	spy.mockClear();
	await fetch("http://localhost:3001");
	await settle();

	expect(spy.mock.calls).toEqual([
		["<--", "GET", "/"],
		["-->", "GET", "/", 200, "in", expect.any(Number), "ms"],
	]);
	await server.stop();
});

test("logs all methods enabled by default", async () => {
	const server = new Elysia()
		.use(logger())
		.get("/", () => "get")
		.put("/", () => "put")
		.post("/", () => "post")
		.delete("/", () => "delete")
		.listen(3002);

	for (const method of ["GET", "PUT", "POST", "DELETE"]) {
		spy.mockClear();
		await fetch("http://localhost:3002", { method });
		await settle();

		expect(spy).toHaveBeenCalledTimes(2);
		expect(spy).toHaveBeenCalledWith("<--", method, "/");
		expect(spy).toHaveBeenCalledWith(
			"-->",
			method,
			"/",
			200,
			"in",
			expect.any(Number),
			"ms",
		);
	}
	await server.stop();
});

test("ignores methods that are not in the default list", async () => {
	const server = new Elysia()
		.use(logger())
		.patch("/", () => "patch")
		.options("/", () => "options")
		.get("/", () => "get")
		.listen(3003);

	for (const method of ["PATCH", "OPTIONS", "HEAD"]) {
		spy.mockClear();
		await fetch("http://localhost:3003", { method });
		await settle();

		expect(spy).not.toHaveBeenCalled();
	}
	await server.stop();
});

test("accepts a custom list of methods", async () => {
	const server = new Elysia()
		.use(logger({ methods: ["PATCH"] }))
		.get("/", () => "get")
		.patch("/", () => "patch")
		.listen(3004);

	spy.mockClear();
	await fetch("http://localhost:3004");
	await settle();
	expect(spy).not.toHaveBeenCalled();

	spy.mockClear();
	await fetch("http://localhost:3004", { method: "PATCH" });
	await settle();
	expect(spy).toHaveBeenCalledTimes(2);
	expect(spy).toHaveBeenCalledWith("<--", "PATCH", "/");
	await server.stop();
});

test("logs the real status for a thrown error", async () => {
	const server = new Elysia()
		.use(logger())
		.get("/", () => {
			throw new Error("Internal Server Error");
		})
		.listen(3005);

	spy.mockClear();
	const response = await fetch("http://localhost:3005");
	await settle();

	expect(response.status).toBe(500);
	expect(spy).toHaveBeenCalledTimes(2);
	expect(spy).toHaveBeenCalledWith("<--", "GET", "/");
	expect(spy).toHaveBeenCalledWith(
		"-->",
		"GET",
		"/",
		500,
		"in",
		expect.any(Number),
		"ms",
	);
	await server.stop();
});

test("logs the real status returned by status()", async () => {
	const server = new Elysia()
		.use(logger())
		.get("/", () => status(404, "Not Found"))
		.listen(3006);

	spy.mockClear();
	const response = await fetch("http://localhost:3006");
	await settle();

	expect(response.status).toBe(404);
	expect(spy).toHaveBeenCalledTimes(2);
	expect(spy).toHaveBeenCalledWith(
		"-->",
		"GET",
		"/",
		404,
		"in",
		expect.any(Number),
		"ms",
	);
	await server.stop();
});

test("logs the real status set on the context", async () => {
	const server = new Elysia()
		.use(logger())
		.get("/", ({ set }) => {
			set.status = 201;
			return "created";
		})
		.listen(3007);

	spy.mockClear();
	const response = await fetch("http://localhost:3007");
	await settle();

	expect(response.status).toBe(201);
	expect(spy).toHaveBeenCalledWith(
		"-->",
		"GET",
		"/",
		201,
		"in",
		expect.any(Number),
		"ms",
	);
	await server.stop();
});

test("logs the path without the query string", async () => {
	const server = new Elysia()
		.use(logger())
		.get("/hello", () => "ok")
		.listen(3008);

	spy.mockClear();
	await fetch("http://localhost:3008/hello?name=world");
	await settle();

	expect(spy).toHaveBeenCalledWith("<--", "GET", "/hello");
	expect(spy).toHaveBeenCalledWith(
		"-->",
		"GET",
		"/hello",
		200,
		"in",
		expect.any(Number),
		"ms",
	);
	await server.stop();
});
