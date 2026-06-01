# toast-meter

A playful Pi footer indicator for context usage that tracks the agent’s journey from smart zone to dumb zone as the context window fills up.

License: MIT  
Author: Sylvia Schmitt

## What it does

- Shows current context usage in Pi's footer
- Uses brains → bricks / bread as the context fills up
- Switches the final stage label to `House is on fire`
- Supports English and German presets
- Lets projects override thresholds only

## Alternative for Claude Code

If you use Claude Code and cannot use the Pi agent extension, see the separate integration in [`integrations/claude-code/README.md`](integrations/claude-code/README.md).

## Install with Pi

Local path:

```json
{
  "packages": ["./path/to/toast-meter"]
}
```

Git:

```json
{
  "packages": ["git:github.com/ai2ys/toast-meter@v0.1.2"]
}
```

npm:

```json
{
  "packages": ["npm:toast-meter@0.1.2"]
}
```

Or via commands:

```bash
pi install /absolute/path/to/toast-meter
pi install git:github.com/ai2ys/toast-meter@v0.1.2
pi install npm:toast-meter@0.1.2
```

## Example output

### English

```text
0k   🧠🧠🧠🧠 • Dumb as a Brick
120k 🧠🧱🧱🧱 • Dumb as a Brick
151k 🏠🔥 • House is on fire
```

### Deutsch

```text
0k   🧠🧠🧠🧠 • Dumm wie Brot
120k 🧠🍞🍞🍞 • Dumm wie Brot
151k 🏠🔥 • House is on fire
```

## Configuration

Package defaults live here:

- `extensions/toast-meter/config.default.json`

Project override (optional):

- `.pi/toast-meter.json`

Example override:

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

## Notes

- Level 0 is fixed in code.
- Icons are fixed in code.
- Thresholds 1–5 are configurable.
- Default mode is `en`.
- The package is discoverable on Pi package listings via the `pi-package` keyword.
