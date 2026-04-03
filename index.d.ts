// from https://github.com/ikawaha/kagome/tree/v2/tokenizer/token.go#L273-L284
export interface Token {
	id: number;
	start: number;
	end: number;
	surface: string;
	class: string;
	pos: string[];
	base_form: string;
	reading: string;
	pronunciation: string;
	features: string[];
}

export type SysDict = "ipa" | "uni";

/**
 * Initializes the Kagome.
 */
export function init(): Promise<void>;

/**
 * Tokenizes the given text into morphological tokens.
 *
 * @param text - Input text to tokenize.
 * @param sysdict - System dictionary. Defaults to `"ipa"`.
 * @returns An array of {@link Token}.
 */
export function tokenize(text: string, sysdict?: SysDict): Token[];