# kagome.wasm
This project is a TypeScript port of [Kagome](https://github.com/ikawaha/Kagome), originally written in Go.

## Example
```typescript
import * as Kagome from "kagome-wasm";

(async () => {
	await Kagome.init();

	const tokens = Kagome.tokenize("ざけんなや呪力が練れんドブカスが");
	console.log(tokens);
})();
```