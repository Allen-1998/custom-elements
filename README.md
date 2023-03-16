# Copy Text

Html native copy components implemented based on `customElements`,`slot`, `shadowRoot`, `clipboard`....

## Usage

- Import js and css file.

```html
<script src="./copy-text.js"></script>
<link rel="stylesheet" href="./copy-text.css" />
```

- Wrap the text you want to copy.

```html
<copy-text>your text...</copy-text>
```

- When you click on this element, it will copy the content to the clipboard and give you a toast for copying success.

## Attention

- `copy-text` will append a copy svg element to your text.

- If you want to custom copy icon, you can also fork the repo and then clone it locally, to view changes and run your tests on your machine.

## Related Efforts

- [MDN: customElements](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements)
- [MDN: slot](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)
- [MDN: clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard)
- [icones](https://icones.js.org/collection/all) - ⚡️ Icon Explorer with Instant searching.

## License

MIT - Allen-1998 2023
