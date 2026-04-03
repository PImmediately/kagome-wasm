import * as Kagome from "./index.js";

(async () => {
	await Kagome.init();

	const tokens = Kagome.tokenize("すもももももももものうち", "uni");
	console.log(tokens);
})();