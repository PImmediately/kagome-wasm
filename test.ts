import * as Kagome from "./index.js";

(async () => {
	await Kagome.init();

	const tokens = Kagome.tokenize("ざけんなや呪力が練れんドブカスが", "uni");
	console.log(tokens);
})();