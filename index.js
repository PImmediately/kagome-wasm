const fs = require("node:fs");

require("./wasm_exec.js");

const go = new Go();
globalThis.crypto = require("node:crypto").webcrypto;
globalThis.performance = require("node:perf_hooks").performance;

let kagome_tokenize;

let hasInit = false;
async function init() {
	if (hasInit) return;
	hasInit = true;

	const wasm = fs.readFileSync(`${__dirname}/kagome.wasm`);
	const result = await WebAssembly.instantiate(wasm, go.importObject);
	go.run(result.instance);

	kagome_tokenize = global.kagome_tokenize;
}

function tokenize(text) {
	if (!kagome_tokenize) throw new Error("Kagome is not initialized. Call init() first.");
	return kagome_tokenize(text).map((token) => ({
		...token,
		pos: token.pos.split(","),
		features: token.features.split(","),
	}));
}

module.exports = {
	init,
	tokenize,
};