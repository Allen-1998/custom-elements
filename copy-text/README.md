# Copy Text

Html native copy component implemented based on `customElements`,`slot`, `shadowRoot`, `clipboard`....

## Usage

- Import js file.

```html
<script src="./copy-text.js"></script>
```

- Wrap the text you want to copy.

```html
<copy-text>your text...</copy-text>
```

- When you click on this element, it will copy the content to the clipboard and give you a toast for copying success.

## Attention

- `copy-text` will append a copy svg element to your text.

- If you want to custom copy icon, you can set the `icon` attribute such as `<copy-text icon="https://you_icon_image_src.com" />`.
