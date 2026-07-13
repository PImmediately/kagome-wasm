const fs = require("node:fs");
const path = require("node:path");
const { parentPort } = require("node:worker_threads");
require(path.join(__dirname, "wasm_exec.js"));

const go = new Go();
globalThis.crypto = require("node:crypto").webcrypto;
globalThis.performance = require("node:perf_hooks").performance;
let kagome_tokenize;

function handle(msg) {
	const { id, text, sysdict } = msg;
	try {
		const tokens = kagome_tokenize(text, sysdict).map((token) => ({
			...token,
			pos: token.pos.split(","),
			features: token.features.split(","),
		}));
		parentPort.postMessage({ id, tokens });
	} catch (err) {
		parentPort.postMessage({ id, error: err.message });
	}
}

(async () => {
	const wasm = fs.readFileSync(path.join(__dirname, "kagome.wasm"));
	const result = await WebAssembly.instantiate(wasm, go.importObject);
	go.run(result.instance);
	kagome_tokenize = global.kagome_tokenize;

	parentPort.postMessage({ id: "ready" });
	parentPort.on("message", handle);
})();