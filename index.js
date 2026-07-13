const path = require("node:path");
const { Worker } = require("node:worker_threads");

let worker;
let ready;
let msgId = 0;
const pending = new Map();

function init() {
	if (ready) return ready;
	worker = new Worker(path.join(__dirname, "index.worker.js"));
	ready = new Promise((resolve, reject) => {
		worker.once("message", (msg) => {
			if (msg.id === "ready") resolve();
		});
		worker.once("error", reject);
	});
	worker.on("message", (msg) => {
		if (msg.id === "ready") return;
		const p = pending.get(msg.id);
		if (!p) return;
		pending.delete(msg.id);
		if (msg.error) p.reject(new Error(msg.error));
		else p.resolve(msg.tokens);
	});
	worker.on("error", (err) => {
		for (const p of pending.values()) p.reject(err);
		pending.clear();
	});
	return ready;
}

function tokenize(text, sysdict = "ipa") {
	if (!worker) throw new Error("Kagome is not initialized. Call init() first.");
	const id = msgId++;
	return new Promise((resolve, reject) => {
		pending.set(id, { resolve, reject });
		worker.postMessage({ id, text, sysdict });
	});
}

module.exports = {
	init,
	tokenize,
};