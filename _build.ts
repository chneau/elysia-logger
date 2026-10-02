import { $ } from "bun";
import packageJson from "./package.json";

await $`rm -rf dist`;

const result = await Bun.build({
	entrypoints: ["src/index.ts"],
	external: Object.keys(packageJson.dependencies),
	outdir: "dist",
	target: "node",
	minify: true,
});

console.log(result);

await $`bunx tsc --ignoreConfig --declaration --emitDeclarationOnly --outDir dist --module esnext --moduleResolution bundler --target esnext --skipLibCheck src/index.ts`;
