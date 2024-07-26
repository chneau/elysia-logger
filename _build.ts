import { $ } from "bun";
import dts from "bun-plugin-dts";
import packageJson from "./package.json";

await $`rm -rf dist`;

await Bun.build({
	entrypoints: ["src/index.ts"],
	external: Object.keys(packageJson.dependencies),
	outdir: "dist",
	target: "node",
	minify: true,
	plugins: [dts({ output: { noBanner: !0 } })],
});
