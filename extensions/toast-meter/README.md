# Context Usage Indicator

Shows the current context usage in Pi's footer.

The name is a joke: it plays on "dumb as a brick" / "dumm wie Brot" as the context fills up.

## What it does

- Reads `ctx.getContextUsage()`
- Displays the current token count as `k`
- Uses emoji levels to visualize the context getting fuller
- Supports German and English presets

## Config

Package defaults live in:

`extensions/toast-meter/config.default.json`

Project overrides can be placed in:

`.pi/toast-meter.json`

Example:

```json
{
  "mode": "en",
  "showText": true,
  "refreshIntervalMs": 2000,
  "levels": {
    "1": 80000,
    "2": 100000,
    "3": 120000,
    "4": 140000,
    "5": 150000
  }
}
```

## Options

- `mode`: `"en"` or `"de"`
- `showText`: show the label next to the value
- `refreshIntervalMs`: update interval
- `levels`: override thresholds for levels 1–5

## Presets

### `en`
- label: `Dumb as a Brick`
- joke: brains turn into bricks as the context gets worse

### `de`
- label: `Dumm wie Brot`
- joke: brains turn into bread as the context gets worse

## Notes

- Level 0 is fixed in code.
- If `levels` is omitted, the built-in defaults are used.
- The extension renders in the footer via `setStatus()`.
- Project config merges with package defaults.
