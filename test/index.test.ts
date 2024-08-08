import { expect, spyOn, test } from "bun:test";
import Elysia, { error } from "elysia";
import { logger } from "../src";

const spy = spyOn(console, "log");

test("working for normal cases", async () => {
	const server = new Elysia()
		.use(logger())
		.get("/", () => "Hello, World!")
		.listen(3000);

	spy.mockClear();
	await fetch("http://localhost:3000");
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

test("working for error cases", async () => {
	const server = new Elysia()
		.use(logger())
		.get("/", () => {
			throw new Error("Internal Server Error");
		})
		.listen(3001);

	spy.mockClear();
	await fetch("http://localhost:3001");
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

test("working for elysia's error cases", async () => {
	const server = new Elysia()
		.use(logger())
		.get("/", () => error(404, "Not Found"))
		.listen(3002);

	spy.mockClear();
	await fetch("http://localhost:3002");
	expect(spy).toHaveBeenCalledTimes(2);
	expect(spy).toHaveBeenCalledWith("<--", "GET", "/");
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
