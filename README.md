# kagome.wasm
This project is a TypeScript port of [Kagome](https://github.com/ikawaha/Kagome), originally written in Go.

## Example
```typescript
import * as Kagome from "kagome-wasm";

(async () => {
	await Kagome.init();

	const tokens = await Kagome.tokenize("すもももももももものうち");
	console.log(tokens);
})();
```