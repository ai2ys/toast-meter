# toast-meter

Playful Pi footer extension for context usage.

License: MIT

Author: Sylvia Schmitt

Pi package for the footer context-usage indicator.

## Install

Local:

```json
{
  "packages": ["./path/to/toast-meter"]
}
```

Git:

```json
{
  "packages": ["git:github.com/you/toast-meter@v0.1.0"]
}
```

## What it does

- Shows current context usage in Pi's footer
- Uses brains/bricks/bread/fire icons as the context fills up
- Supports English and German presets
- Lets projects override thresholds only

## Configuration

Package defaults live here:

- `extensions/toast-meter/config.default.json`

Project override (optional):

- `.pi/toast-meter.json`

## Notes

- Level 0 is fixed in code.
- Icons are fixed in code.
- Thresholds 1–5 are configurable.
- Default mode is `en`.
