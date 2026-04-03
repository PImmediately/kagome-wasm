// from https://zenn.dev/link/comments/1dfd3b02d60eea
package main

import (
	"strings"
	"syscall/js"

	"github.com/ikawaha/kagome-dict/ipa"
	"github.com/ikawaha/kagome-dict/uni"
	"github.com/ikawaha/kagome/v2/tokenizer"
)

func igOK(s string, _ bool) string {
	return s
}

var (
	ipaTokenizer    *tokenizer.Tokenizer
	unidicTokenizer *tokenizer.Tokenizer
)

func getTokenizer(dict string) *tokenizer.Tokenizer {
	switch dict {
	case "uni":
		if unidicTokenizer == nil {
			t, err := tokenizer.New(uni.Dict(), tokenizer.OmitBosEos())
			if err != nil {
				return nil
			}
			unidicTokenizer = t
		}
		return unidicTokenizer
	default:
		if ipaTokenizer == nil {
			t, err := tokenizer.New(ipa.Dict(), tokenizer.OmitBosEos())
			if err != nil {
				return nil
			}
			ipaTokenizer = t
		}
		return ipaTokenizer
	}
}

func tokenize(_ js.Value, args []js.Value) interface{} {
	if len(args) == 0 {
		return nil
	}

	text := args[0].String()

	dict := "ipa"
	if len(args) > 1 {
		dict = args[1].String()
	}

	t := getTokenizer(dict)
	if t == nil {
		return nil
	}

	var ret []interface{}
	tokens := t.Tokenize(text)
	for _, v := range tokens {
		ret = append(ret, map[string]interface{}{
			"id":            v.ID,
			"start":         v.Start,
			"end":           v.End,
			"surface":       v.Surface,
			"class":         v.Class.String(),
			"pos":           strings.Join(v.POS(), ","),
			"base_form":     igOK(v.BaseForm()),
			"reading":       igOK(v.Reading()),
			"pronunciation": igOK(v.Pronunciation()),
			"features":      strings.Join(v.Features(), ","),
		})
	}
	return ret
}

func registerCallbacks() {
	_ = ipa.Dict()
	js.Global().Set("kagome_tokenize", js.FuncOf(tokenize))
}

func main() {
	c := make(chan struct{}, 0)
	registerCallbacks()
	<-c
}
